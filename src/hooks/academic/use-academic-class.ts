"use client";

import { useState, useMemo } from "react";
import { getClassBySlug, getStudentsByClassId } from "@/lib/dumy-class";

export function useAcademicClass(slug: string) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const classData = useMemo(() => getClassBySlug(slug), [slug]);
  const students = useMemo(() => classData ? getStudentsByClassId(classData.id) : [], [classData]);

  const filteredStudents = useMemo(() => 
    students.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery)
    ), [students, searchQuery]);

  return { 
    classData, 
    searchQuery, 
    setSearchQuery, 
    filteredStudents 
  };
}