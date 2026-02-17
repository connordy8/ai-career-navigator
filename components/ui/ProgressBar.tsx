interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-ma-text-light">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm text-ma-text-light">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-ma-border rounded-full overflow-hidden">
        <div
          className="h-full bg-ma-teal rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
