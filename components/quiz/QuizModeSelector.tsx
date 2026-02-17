// 'use client';

// import { motion } from 'framer-motion';
// import { QuizMode, QuizConfig } from '@/types/quiz';
// import { Play, Zap, FileCheck, Clock, HelpCircle } from 'lucide-react';

// interface QuizModeSelectorProps {
//   onSelectMode: (config: QuizConfig) => void;
//   title: string;
//   questionCount?: number;
//   timeLimit?: number;
// }

// // --- Sub-Components ---

// const CardTitle = ({ 
//   children, 
//   lineClamp = 4 
// }: { 
//   children: React.ReactNode
//   lineClamp?: 3 | 4 
// }) => {
//   const lineClampClass = lineClamp === 3 ? "line-clamp-3" : "line-clamp-4"
//   return (
//     <h2 className={`text-3xl lg:text-4xl font-bold uppercase text-ellipsis text-balance ${lineClampClass}`}>
//       {children}
//     </h2>
//   )
// }

// const CardDescription = ({ children }: { children: React.ReactNode }) => (
//   <p className="text-base uppercase text-ellipsis text-pretty mt-2 line-clamp-2">
//     {children}
//   </p>
// )

// const CardContent = ({ 
//   title, 
//   description, 
//   lineClamp = 4 
// }: { 
//   title: string
//   description?: string
//   lineClamp?: 3 | 4 
// }) => (
//   <div className="flex-1 flex flex-col justify-between overflow-hidden">
//     <div>
//       <CardTitle lineClamp={lineClamp}>{title}</CardTitle>
//       {description && <CardDescription>{description}</CardDescription>}
//     </div>
//   </div>
// )

// const CardFooter = ({ children }: { children: React.ReactNode }) => (
//   <footer className="flex justify-between items-end">
//     {children}
//   </footer>
// )

// const TagList = ({ 
//   tags, 
//   bgColor 
// }: { 
//   tags: string[]
//   bgColor: string
// }) => (
//   <div className="flex gap-1 flex-wrap justify-start w-full">
//     {tags.map((tag, index) => (
//       <motion.span
//         key={index}
//         initial={{ opacity: 0, scale: 0.8 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ delay: 0.3 + index * 0.05 }}
//         className="text-black border-black border border-solid rounded-full px-3 h-9 
//                    transition-all flex justify-center items-center whitespace-nowrap 
//                    hover:rounded-[8px] duration-300 cursor-default"
//         style={{ backgroundColor: bgColor }}
//       >
//         <p className="text-xs font-medium uppercase line-clamp-1">{tag}</p>
//       </motion.span>
//     ))}
//   </div>
// )

// const ActionButton = ({ 
//   icon: Icon, 
//   size = "w-6 h-6" 
// }: { 
//   icon: React.ElementType
//   size?: string 
// }) => (
//   <div className="flex items-center justify-center w-9 h-9 flex-shrink-0">
//     <motion.div 
//       whileHover={{ scale: 1.1 }}
//       whileTap={{ scale: 0.95 }}
//       className="flex items-center justify-center w-9 h-9 border border-black border-solid rounded-full
//                  transition-colors hover:bg-black hover:text-white"
//     >
//       <Icon className={size} />
//     </motion.div>
//   </div>
// )

// const MediaSection = ({ 
//   icon: Icon,
//   bgColor,
// }: { 
//   icon: React.ElementType
//   bgColor: string
// }) => (
//   <motion.div 
//     className="relative overflow-hidden rounded-sm z-0 h-[210px] w-full flex items-center justify-center"
//     style={{ backgroundColor: `color-mix(in srgb, ${bgColor} 85%, black)` }}
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     transition={{ delay: 0.2 }}
//   >
//     <div className="absolute inset-0 opacity-10">
//       <div className="absolute inset-0" style={{
//         backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
//         backgroundSize: '24px 24px'
//       }} />
//     </div>

//     <motion.div
//       initial={{ scale: 0, rotate: -10 }}
//       animate={{ scale: 1, rotate: 0 }}
//       transition={{ 
//         type: "spring", 
//         stiffness: 200, 
//         damping: 15,
//         delay: 0.3 
//       }}
//       className="relative z-10"
//     >
//       <div className="w-20 h-20 rounded-2xl bg-black/10 backdrop-blur-sm flex items-center justify-center
//                       border border-black/10">
//         <Icon className="w-10 h-10 text-black/60" strokeWidth={1.5} />
//       </div>
//     </motion.div>
//   </motion.div>
// )

// // --- Mode Card ---

// interface ModeCardProps {
//   mode: QuizMode
//   title: string
//   description: string
//   icon: React.ElementType
//   bgColor: string
//   features: string[]
//   onClick: () => void
//   index: number
// }

// const ModeCard = ({
//   title,
//   description,
//   icon,
//   bgColor,
//   features,
//   onClick,
//   index,
// }: ModeCardProps) => {
//   const commonWrapper = `relative cursor-pointer rounded-2xl flex-shrink-0 sm:w-[325px] w-full min-w-[260px] h-[475px]`

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{
//         type: "spring",
//         stiffness: 300,
//         damping: 30,
//         delay: index * 0.15,
//       }}
//       whileHover={{ 
//         y: -12,
//         transition: { type: "spring", stiffness: 400, damping: 20 }
//       }}
//       whileTap={{ scale: 0.98 }}
//       onClick={onClick}
//       className={`${commonWrapper} text-black`}
//       style={{ backgroundColor: bgColor }}
//     >
//       <div className="flex h-full p-3.5 flex-col-reverse gap-y-3.5">
//         <CardFooter>
//           <TagList tags={features} bgColor={bgColor} />
//           <ActionButton icon={Play} size="w-5 h-5" />
//         </CardFooter>

//         <MediaSection icon={icon} bgColor={bgColor} />

//         <CardContent title={title} description={description} />
//       </div>
//     </motion.div>
//   )
// }

// // --- Header Badge ---

// const InfoBadge = ({ 
//   icon: Icon, 
//   label 
// }: { 
//   icon: React.ElementType
//   label: string 
// }) => (
//   <motion.span
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.4 }}
//     className="inline-flex items-center gap-1.5 text-white/70 border border-white/20 
//                rounded-full px-3 h-8 bg-white/5 text-xs uppercase font-medium"
//   >
//     <Icon className="w-3.5 h-3.5" />
//     {label}
//   </motion.span>
// )

// // --- Main Component ---

// const modes = [
//   {
//     id: 'instant-feedback' as QuizMode,
//     title: 'Learn Mode',
//     description: 'Get instant feedback after each question',
//     icon: Zap,
//     bgColor: '#F57799',
//     features: ['Instant', 'Explanations', 'Learn'],
//   },
//   {
//     id: 'submit-all' as QuizMode,
//     title: 'Test Mode',
//     description: 'Submit all answers then review results',
//     icon: FileCheck,
//     bgColor: '#A5C89E',
//     features: ['Real Test', 'No Peeking', 'Review'],
//   },
// ]

// export function QuizModeSelector({
//   onSelectMode,
//   title,
//   questionCount = 6,
//   timeLimit = 300,
// }: QuizModeSelectorProps) {
//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60)
//     return `${mins} min`
//   }

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="w-full max-w-[700px] space-y-10"
//       >
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ type: "spring", stiffness: 300, damping: 30 }}
//           className="text-center space-y-5"
//         >
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
//             className="w-14 h-14 mx-auto rounded-xl bg-white/5 border border-white/10 
//                        flex items-center justify-center"
//           >
//             <span className="text-2xl">🎯</span>
//           </motion.div>

//           <div className="space-y-2">
//             <motion.h1 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight"
//             >
//               {title}
//             </motion.h1>
//             <motion.p 
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="text-white/60 uppercase text-sm tracking-wide"
//             >
//               Select your preferred mode
//             </motion.p>
//           </div>

//           <div className="flex items-center justify-center gap-2">
//             <InfoBadge icon={HelpCircle} label={`${questionCount} Questions`} />
//             <InfoBadge icon={Clock} label={formatTime(timeLimit)} />
//           </div>
//         </motion.div>

//         {/* Mode Cards */}
//         <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
//           {modes.map((mode, index) => (
//             <ModeCard
//               key={mode.id}
//               mode={mode.id}
//               title={mode.title}
//               description={mode.description}
//               icon={mode.icon}
//               bgColor={mode.bgColor}
//               features={mode.features}
//               onClick={() => onSelectMode({
//                 mode: mode.id,
//                 color: mode.bgColor,
//                 title: mode.title
//               })}
//               index={index}
//             />
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   )
// }


// src/components/quiz/QuizModeSelector.tsx
'use client';

import { motion } from 'framer-motion';
import { QuizConfig, QuizType } from '@/types/quiz';
import { Play, Brain, Clock, HelpCircle } from 'lucide-react';
import MediaDisplay from '../post/media-display';

interface QuizModeSelectorProps {
  onSelectMode: (config: QuizConfig) => void;
  title: string;
  questionCount?: number;
  timeLimit?: number;
  quizType?: QuizType;
}

// Card components (same as before)
const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl lg:text-4xl font-bold uppercase text-ellipsis text-balance line-clamp-4">
    {children}
  </h2>
);

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-base uppercase text-ellipsis text-pretty mt-2 line-clamp-2">
    {children}
  </p>
);

const CardContent = ({ title, description }: { title: string; description?: string }) => (
  <div className="flex-1 flex flex-col justify-between overflow-hidden">
    <div>
      <CardTitle>{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </div>
  </div>
);

const CardFooter = ({ children }: { children: React.ReactNode }) => (
  <footer className="flex justify-between items-end">{children}</footer>
);

const TagList = ({ tags, bgColor }: { tags: string[]; bgColor: string }) => (
  <div className="flex gap-1 flex-wrap justify-start w-full">
    {tags.map((tag, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 + index * 0.05 }}
        className="text-black border-black border border-solid rounded-full px-3 h-9 
                   transition-all flex justify-center items-center whitespace-nowrap 
                   hover:rounded-[8px] duration-300 cursor-default"
        style={{ backgroundColor: bgColor }}
      >
        <p className="text-xs font-medium uppercase line-clamp-1">{tag}</p>
      </motion.span>
    ))}
  </div>
);

const ActionButton = ({ icon: Icon }: { icon: React.ElementType }) => (
  <div className="flex items-center justify-center w-9 h-9 flex-shrink-0">
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center w-9 h-9 border border-black border-solid rounded-full
                 transition-colors hover:bg-black hover:text-white"
    >
      <Icon className="w-5 h-5" />
    </motion.div>
  </div>
);

const MediaSection = ({ icon: Icon, bgColor }: { icon: React.ElementType; bgColor: string }) => (
  <motion.div
    className="relative overflow-hidden rounded-sm z-0 h-[210px] w-full flex items-center justify-center"
    style={{ backgroundColor: `color-mix(in srgb, ${bgColor} 85%, black)` }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
    {/* <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }} />
    </div>
    
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
      className="relative z-10"
    >
      <div className="w-20 h-20 rounded-2xl bg-black/10 backdrop-blur-sm flex items-center justify-center border border-black/10">
        <Icon className="w-10 h-10 text-black/60" strokeWidth={1.5} />
      </div>
    </motion.div> */}
    <MediaDisplay src='/images/path.jpg' alt='path image' 
      type={'image'}
      className="w-full h-full"
      sizes={'full'}
      // autoPlay={type === "video"}
       />
  </motion.div>
);

// Main Component
export function QuizModeSelector({
  onSelectMode,
  title,
  questionCount = 16,
  timeLimit = 600,
  quizType = 'personality',
}: QuizModeSelectorProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  // For personality quiz, we just have one mode - direct selection
  const handleStart = () => {
    onSelectMode({
      mode: 'submit-all',
      color: '#F57799',
      title: 'Career Quiz',
      type: quizType,
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-[325px] space-y-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="text-center space-y-5"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
            className="w-14 h-14 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <span className="text-2xl">🎯</span>
          </motion.div>

          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/60 uppercase text-sm tracking-wide"
            >
              Discover your ideal career path
            </motion.p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-1.5 text-white/70 border border-white/20 
                         rounded-full px-3 h-8 bg-white/5 text-xs uppercase font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {questionCount} Questions
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-1.5 text-white/70 border border-white/20 
                         rounded-full px-3 h-8 bg-white/5 text-xs uppercase font-medium"
            >
              <Clock className="w-3.5 h-3.5" />
              {formatTime(timeLimit)}
            </motion.span>
          </div>
        </motion.div>

        {/* Single Card for Personality Quiz */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
          whileHover={{ y: -12, transition: { type: "spring", stiffness: 400, damping: 20 } }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="relative cursor-pointer rounded-2xl w-full h-[475px] text-black"
          style={{ backgroundColor: '#F57799' }}
        >
          <div className="flex h-full p-3.5 flex-col-reverse gap-y-3.5">
            <CardFooter>
              <TagList tags={['16 Questions', 'Personality', 'Career']} bgColor="#F57799" />
              <ActionButton icon={Play} />
            </CardFooter>

            <MediaSection icon={Brain} bgColor="#F57799" />

            <CardContent
              title="Find Your Path"
              description="Answer questions to discover your ideal career"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}