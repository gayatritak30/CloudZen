"use client";
import { createTestimonial } from "@/lib/actions";
import Link from "next/link";
import { useUser as useUserContext } from "@/context/user-context";
import { useRef, useState } from "react";
import { useCourses } from "@/hooks/use-courses";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, XCircle, ChevronRight, Home, Download, CheckCircle2 } from "lucide-react";
import { CertificatePreview } from "@/components/certificate";
import { downloadPDF } from "@/lib/downloadPDF";
import { useUser } from "@clerk/nextjs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";

export default function CourseTestPage() {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const { getCourseById } = useCourses();
  const course = getCourseById(id as string);
  const { user } = useUser();
  const { completeTest, issueCertificate } = useUserContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const isMobile = useIsMobile();
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!course) return null;

  const currentQuestion = course.test[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === course.test.length - 1;

  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    course.test.forEach((q) => {
      console.log(q.correctAnswer, selectedAnswers[q.id]);
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / course.test.length) * 100);
    setScore(finalScore);
    setIsSubmitted(true);
    completeTest(course.id, finalScore);

    if (finalScore >= 70) {
      issueCertificate(course.id);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  const handleDownload = async () => {
    if (isMobile && mobileRef.current) {
      mobileRef.current.style.display = "block";
      await downloadPDF(mobileRef.current);
      mobileRef.current.style.display = "none";
    } else if (ref.current) {
      await downloadPDF(ref.current);
    }
  };


  const addTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (message.trim() === "") return;
    await createTestimonial(
      user?.fullName || "Anonymous",
      user?.emailAddresses[0].emailAddress || "",
      message
    );
    setMessage("");
    setLoading(false);
  };

  if (isSubmitted) {
    const passed = score >= 70;

    return (
      <div className="p-4 md:p-8 max-w-2xl md:max-w-4xl mx-auto space-y-6 md:space-y-8">
        <Card className="text-center md:p-8 p-6 overflow-hidden relative">
          {passed && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400" />
          )}
          <CardHeader>
            <div className="mx-auto w-16 md:w-20 h-16 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              {passed ? (
                <Award className="h-8 md:h-10 w-8 md:w-10 text-primary" />
              ) : (
                <XCircle className="h-8 md:h-10 w-8 md:w-10 text-destructive" />
              )}
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              {passed ? "Congratulations!" : "Test Not Passed"}
            </CardTitle>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              You scored {score}% on the {course.title} Final Assessment
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-xl p-4 md:p-6 border border-border max-w-md mx-auto">
              <div className="flex justify-between text-xs md:text-sm font-medium mb-2">
                <span>Pass Requirement: 70%</span>
                <span
                  className={passed ? "text-green-500" : "text-destructive"}
                >
                  {score}%
                </span>
              </div>
              <Progress
                value={score}
                className={`h-3 ${
                  passed ? "bg-primary/20" : "bg-destructive/20"
                }`}
              />
            </div>

            {passed ? (
              <div className="space-y-4">
                <p className="text-sm max-w-md mx-auto">
                  You've successfully mastered the foundations of{" "}
                  {course.language}. Your official certificate of completion is
                  now ready for download.
                </p>

                <div className="relative w-full hidden md:block" ref={ref}>
                  <div className="aspect-video">
                    <CertificatePreview
                      studentName={user?.fullName || "Student Name"}
                      courseName={course.title}
                      instructorName={course.instructor}
                      completionDate={new Date().toLocaleDateString()}
                      certificateId={Math.random().toString(36).substring(2)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  <Button
                    className="gap-2 w-full md:w-auto"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm max-w-md mx-auto">
                  Don't worry! Coding takes practice. We recommend reviewing the
                  lesson notes and trying the compiler exercises again before
                  retaking the test.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="bg-transparent w-full md:w-auto"
                >
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="justify-center border-t pt-4 md:pt-6">
            <Button
              variant="ghost"
              className="gap-2 text-sm md:text-base"
              asChild
            >
              <Link href="/">
                <Home className="h-4 w-4" /> Return to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <div
          className="md:hidden block"
          style={{
            display: "none",
            position: "fixed",
            top: 0,
            left: 0,
            width: "550px", // fixed printable width
            background: "#fff", // IMPORTANT: not display:none
            pointerEvents: "none",
            zIndex: -10,
          }}
          ref={mobileRef}
        >
          <CertificatePreview
            studentName={user?.fullName || "Student Name"}
            courseName={course.title}
            instructorName={course.instructor}
            completionDate={new Date().toLocaleDateString()}
            certificateId={Math.random().toString(36).substring(2)}
          />
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Review Your Answers</h2>
          <div className="grid gap-4">
            {course.test.map((q, qIndex) => {
              const userChoice = selectedAnswers[q.id];
              const isCorrect = userChoice === q.correctAnswer;
              return (
                <Card
                  key={q.id}
                  className={`overflow-hidden border-l-4 ${
                    isCorrect ? "border-l-green-500" : "border-l-destructive"
                  }`}
                >
                  <CardHeader className="pb-2 p-4 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-base md:text-lg">
                        {qIndex + 1}. {q.question}
                      </CardTitle>
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive shrink-0 mt-1" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 p-4 md:p-6 pt-0">
                    {q.options.map((option, oIndex) => {
                      const isUserSelection = userChoice === oIndex;
                      const isCorrectAnswer = q.correctAnswer === oIndex;

                      return (
                        <div
                          key={oIndex}
                          className={`p-3 rounded-md text-sm border transition-colors flex items-center justify-between gap-2 ${
                            isCorrectAnswer
                              ? "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400 font-medium"
                              : isUserSelection && !isCorrect
                              ? "bg-destructive/10 border-destructive/50 text-destructive font-medium"
                              : "bg-muted/30 border-transparent text-muted-foreground"
                          }`}
                        >
                          <span>{option}</span>
                          <div className="flex gap-1">
                            {isCorrectAnswer && (
                              <Badge
                                variant="outline"
                                className="text-[10px] h-4 bg-green-500/20 text-green-700 border-green-500/30 px-1"
                              >
                                Correct
                              </Badge>
                            )}
                            {isUserSelection && !isCorrect && (
                              <Badge
                                variant="outline"
                                className="text-[10px] h-4 bg-destructive/20 text-destructive border-destructive/30 px-1"
                              >
                                Your Choice
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Share Your Feedback
          </h2>
          <Card className="p-8 border border-border bg-card">
            <form onSubmit={addTestimonial} className="space-y-4">
              <Textarea
                placeholder="Share your testimonial..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-32 resize-none"
              />
              <Button
                type="submit"
                disabled={loading || !message.trim()}
                className="w-full"
              >
                {loading ? "Submitting..." : "Submit Testimonial"}
              </Button>
            </form>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl md:max-w-3xl mx-auto space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <Badge variant="secondary" className="mb-2 text-xs md:text-sm">
            Assessment
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
        </div>
        <div className="text-right w-full md:w-auto">
          <div className="text-xs md:text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {course.test.length}
          </div>
          <Progress
            value={((currentQuestionIndex + 1) / course.test.length) * 100}
            className="w-full md:w-32 mt-2 h-1"
          />
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl font-medium leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <RadioGroup
            value={selectedAnswers[currentQuestion.id]?.toString()}
            onValueChange={(val) => handleSelectAnswer(Number.parseInt(val))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <Label
                key={index}
                className={`flex items-center gap-3 p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAnswers[currentQuestion.id] === index
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <RadioGroupItem value={index.toString()} className="sr-only" />
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedAnswers[currentQuestion.id] === index
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {selectedAnswers[currentQuestion.id] === index && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <span className="text-sm md:text-base">{option}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row justify-between gap-3 border-t pt-4 md:pt-6 p-4 md:p-6">
          <Button
            variant="ghost"
            onClick={() =>
              setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
            }
            disabled={currentQuestionIndex === 0}
            className="bg-transparent w-full md:w-auto"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion.id] === undefined}
            className="gap-2 w-full md:w-auto md:min-w-[120px]"
          >
            {isLastQuestion ? "Submit Test" : "Next Question"}{" "}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
