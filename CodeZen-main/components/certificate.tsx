import { Logo } from "./brand/logo"

interface CertificatePreviewProps {
  studentName: string
  courseName: string
  instructorName: string
  completionDate: string
  certificateId: string
}

export function CertificatePreview({
  studentName,
  courseName,
  instructorName,
  completionDate,
  certificateId,
}: CertificatePreviewProps) {
  return (
    <div
      id="certificate"
      className="bg-white p-4 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden aspect-video h-full w-full"
    >
      {/* Decorative border */}
      <div className="absolute inset-2 sm:inset-4 border-2 sm:border-4 border-amber-500 pointer-events-none">
        <div className="absolute inset-1 sm:inset-2 border border-amber-300"></div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-8 sm:w-16 h-8 sm:h-16 border-t-2 border-l-2 border-amber-400"></div>
      <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-8 sm:w-16 h-8 sm:h-16 border-t-2 border-r-2 border-amber-400"></div>
      <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-8 sm:w-16 h-8 sm:h-16 border-b-2 border-l-2 border-amber-400"></div>
      <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 w-8 sm:w-16 h-8 sm:h-16 border-b-2 border-r-2 border-amber-400"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-8 lg:px-16 space-y-1 lg:space-y-2">
        {/* Award Icon */}
        <div className="w-full flex justify-center items-center">
          <Logo showText={false} size="lg" />
        </div>

        {/* Title */}
        <h1 className="text-lg md:text-xl lg:text-2xl font-serif text-gray-800">Certificate of Completion</h1>

        {/* Subtitle */}
        <p className="text-xs text-gray-600 uppercase tracking-wider">This is to certify that</p>

        {/* Student Name */}
        <h2 className="text-lg md:text-xl lg:text-2xl font-serif text-gray-900 border-b-2 border-amber-500 pb-1 sm:pb-2 px-4 sm:px-8">
          {studentName || "Student Name"}
        </h2>

        {/* Course Info */}
        <p className="text-gray-700 text-xs sm:text-sm">has successfully completed the course</p>
        <h3 className="text-base md:text-xl lg:text-2xl font-serif text-amber-700">{courseName || "Course Name"}</h3>

        {/* Date and Instructor */}
        <div className="flex justify-between w-full my-1 sm:my-2 gap-2">
          <div className="flex-1 border-t-2 border-gray-400">
            <p className="text-xs text-gray-600">Date</p>
            <p className="text-gray-800 text-xs">{completionDate || "MM/DD/YYYY"}</p>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1 relative">
            <div className="absolute -top-10 left-0 right-0 flex justify-center pointer-events-none">
              <img 
                src="/signature.png" 
                alt="Signature" 
                className="h-12 md:h-16 object-contain mix-blend-multiply" 
              />
            </div>
            <div className="border-t-2 border-gray-400 mt-2">
              <p className="text-xs text-gray-600">Instructor</p>
              <p className="text-gray-800 text-xs font-semibold">{instructorName || "Instructor Name"}</p>
            </div>
          </div>
        </div>

        {/* Certificate ID */}
        <div className="text-xs text-gray-500">Certificate ID: {certificateId || "CERT-XXXX-XXXX"}</div>
      </div>
    </div>
  )
}
