// components/adminform/universityform/StepIndicator.jsx
export default function StepIndicator({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
}) {
  return (
    <div className="flex justify-between items-center mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">
        Step {currentStep} of {totalSteps}
      </h3>

      <div className="flex gap-4">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={onPrev}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Previous
          </button>
        )}

        {currentStep < totalSteps && (
          <button
            type="button"
            onClick={onNext}
            className="px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}