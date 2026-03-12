"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Github, Twitter, Linkedin, Youtube } from "lucide-react";
import { COURSES } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-foreground/5 bg-background flex flex-col-reverse items-center md:flex-row py-10 max-w-6xl mx-auto">
      <div className="container mx-auto px-4 py-8 md:w-[30%] flex">
        <div className="pt-8 border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <div className="text-sm text-muted-foreground flex flex-col justify-center items-center w-full">
            <Link href="/" className="inline-block mb-2 group">
              <Logo size="md" />
            </Link>
            © 2026 CodeZen. All rights reserved.
          </div>
        </div>
      </div>
      <div className=" w-px bg-black/50"></div>
      <div className="md:w-[70%]">
        {/* <h1 className=" font-bold text-center mb-2">Courses</h1> */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 justify-items-center">
          {COURSES.map((course) => (
            <li key={course.title}>
              <Link
                href={`/courses/${course.id}`}
                className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {course.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
