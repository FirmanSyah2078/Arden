"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
  type TransitionEvent,
} from "react"

export const FLIP_DURATION = 900

export const FLIP_EASING =
  "cubic-bezier(0.65, 0, 0.35, 1)"

interface Tilt {
  x: number
  y: number
}

interface UseIdentityCardMotionOptions {
  cardRef: RefObject<HTMLDivElement | null>
}

interface UseIdentityCardMotionReturn {
  flipped: boolean
  isFlipping: boolean
  hovering: boolean

  handlePointerMove: (
    e: PointerEvent<HTMLDivElement>
  ) => void

  handlePointerEnter: () => void

  handlePointerLeave: () => void

  handleFlip: () => void

  handleTransitionEnd: (
    e: TransitionEvent<HTMLDivElement>
  ) => void
}

const clamp = (
  value: number,
  min: number,
  max: number
) => {
  return Math.min(
    Math.max(value, min),
    max
  )
}

export function useIdentityCardMotion({
  cardRef,
}: UseIdentityCardMotionOptions): UseIdentityCardMotionReturn {
  const [flipped, setFlipped] =
    useState(false)

  const [isFlipping, setIsFlipping] =
    useState(false)

  const [hovering, setHovering] =
    useState(false)

  const rafRef =
    useRef<number | null>(null)

  const pendingTiltRef =
    useRef<Tilt>({
      x: 0,
      y: 0,
    })

  const reducedMotionRef =
    useRef(false)

  /*
   * ============================================================
   * REDUCED MOTION
   * ============================================================
   */

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      )

    const updateReducedMotion = () => {
      reducedMotionRef.current =
        mediaQuery.matches
    }

    updateReducedMotion()

    mediaQuery.addEventListener(
      "change",
      updateReducedMotion
    )

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updateReducedMotion
      )

      if (rafRef.current !== null) {
        cancelAnimationFrame(
          rafRef.current
        )

        rafRef.current = null
      }
    }
  }, [])

  /*
   * ============================================================
   * APPLY TILT
   * ============================================================
   */

  const applyTilt = useCallback(
    (tilt: Tilt) => {
      const element =
        cardRef.current

      if (!element) {
        return
      }

      element.style.setProperty(
        "--tilt-x",
        `${tilt.x}deg`
      )

      element.style.setProperty(
        "--tilt-y",
        `${tilt.y}deg`
      )
    },
    [cardRef]
  )

  /*
   * ============================================================
   * RESET TILT
   * ============================================================
   */

  const resetTilt = useCallback(() => {
    pendingTiltRef.current = {
      x: 0,
      y: 0,
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(
        rafRef.current
      )

      rafRef.current = null
    }

    applyTilt({
      x: 0,
      y: 0,
    })
  }, [applyTilt])

  /*
   * ============================================================
   * SCHEDULE TILT
   * ============================================================
   *
   * Pointer move tidak langsung melakukan
   * React state update.
   *
   * Hanya CSS custom property yang diubah
   * melalui requestAnimationFrame.
   */

  const scheduleTilt = useCallback(
    (tilt: Tilt) => {
      pendingTiltRef.current = tilt

      if (rafRef.current !== null) {
        return
      }

      rafRef.current =
        requestAnimationFrame(() => {
          rafRef.current = null

          applyTilt(
            pendingTiltRef.current
          )
        })
    },
    [applyTilt]
  )

  /*
   * ============================================================
   * POINTER MOVE
   * ============================================================
   *
   * FRONT:
   *     tilt aktif
   *
   * BACK:
   *     tilt juga aktif
   *
   * FLIPPING:
   *     tilt dikunci
   *
   * Ini yang membuat kedua sisi kartu
   * memiliki pengalaman interaksi yang sama.
   */

  const handlePointerMove = useCallback(
    (
      e: PointerEvent<HTMLDivElement>
    ) => {
      if (
        isFlipping ||
        reducedMotionRef.current
      ) {
        resetTilt()
        return
      }

      const element =
        cardRef.current

      if (!element) {
        return
      }

      const rect =
        element.getBoundingClientRect()

      const px =
        (e.clientX - rect.left) /
          rect.width -
        0.5

      const py =
        (e.clientY - rect.top) /
          rect.height -
        0.5

      /*
       * Sama dengan front.
       *
       * X:
       * -14° sampai +14°
       *
       * Y:
       * -16° sampai +16°
       */

      const x = clamp(
        py * -14,
        -14,
        14
      )

      const y = clamp(
        px * 16,
        -16,
        16
      )

      scheduleTilt({
        x,
        y,
      })
    },
    [
      cardRef,
      isFlipping,
      resetTilt,
      scheduleTilt,
    ]
  )

  /*
   * ============================================================
   * POINTER ENTER
   * ============================================================
   */

  const handlePointerEnter =
    useCallback(() => {
      if (
        isFlipping ||
        reducedMotionRef.current
      ) {
        return
      }

      setHovering(true)
    }, [isFlipping])

  /*
   * ============================================================
   * POINTER LEAVE
   * ============================================================
   */

  const handlePointerLeave =
    useCallback(() => {
      setHovering(false)

      if (!isFlipping) {
        resetTilt()
      }
    }, [
      isFlipping,
      resetTilt,
    ])

  /*
   * ============================================================
   * FLIP
   * ============================================================
   */

  const handleFlip = useCallback(() => {
    if (isFlipping) {
      return
    }

    /*
     * Selalu netralkan tilt dahulu.
     *
     * Jadi kartu tidak sedang miring
     * ketika animasi flip dimulai.
     */

    setHovering(false)

    resetTilt()

    setIsFlipping(true)

    setFlipped(
      (current) => !current
    )
  }, [
    isFlipping,
    resetTilt,
  ])

  /*
   * ============================================================
   * TRANSITION END
   * ============================================================
   */

  const handleTransitionEnd =
    useCallback(
      (
        e: TransitionEvent<HTMLDivElement>
      ) => {
        /*
         * Hanya transform yang menjadi
         * trigger selesainya flip.
         */

        if (
          e.propertyName !==
          "transform"
        ) {
          return
        }

        setIsFlipping(false)

        /*
         * Setelah flip selesai:
         *
         * tilt kembali boleh digunakan
         * baik di front maupun back.
         */

        resetTilt()
      },
      [resetTilt]
    )

  return {
    flipped,
    isFlipping,
    hovering,

    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleFlip,
    handleTransitionEnd,
  }
}