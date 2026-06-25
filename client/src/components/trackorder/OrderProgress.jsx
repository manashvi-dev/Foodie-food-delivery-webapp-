import { CheckCircle } from "../../constants/icons";

export default function OrderProgress({
  status,
  currentStep,
  currentStepIndex,
  steps,
}) {
  const BannerIcon = currentStep?.icon;

  return (
    <>
      {/* Banner */}
      <div className="track-banner">
        <span className="track-banner-icon">
          {BannerIcon && <BannerIcon size={30} />}
        </span>

        <div>
          <h2>{currentStep?.label}</h2>
          <p>{currentStep?.desc}</p>
        </div>

        {status !== "delivered" && (
          <div className="track-pulse">
            <span></span>
            Live
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="track-steps">
        {steps.map((step, index) => {
          const isDone = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          const StepIcon = step.icon;

          return (
            <div
              key={step.key}
              className="track-step-wrap"
            >
              <div
                className={`track-step
                  ${isDone ? "done" : ""}
                  ${isActive ? "active" : ""}
                  ${isPending ? "pending" : ""}`}
              >
                <div className="track-step-circle">
                  {isDone ? (
                    <CheckCircle size={18} />
                  ) : (
                    <StepIcon size={20} />
                  )}
                </div>

                <div className="track-step-info">
                  <p className="track-step-label">
                    {step.label}
                  </p>

                  <p className="track-step-desc">
                    {step.desc}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`track-connector ${
                    isDone ? "done" : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
