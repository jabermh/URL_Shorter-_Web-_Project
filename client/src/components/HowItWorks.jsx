import {
  FaPaste,
  FaLink,
  FaChartLine,
} from "react-icons/fa";

const steps = [
  {
    icon: FaPaste,
    title: "Paste Your URL",
    description:
      "Enter any long URL you want to shorten. Shorty accepts standard web URLs and prepares them for sharing.",
  },
  {
    icon: FaLink,
    title: "Generate Short Link",
    description:
      "Create a compact, shareable URL instantly and copy it with a single click.",
  },
  {
    icon: FaChartLine,
    title: "Manage Links",
    description:
      "View click counts, copy links, generate QR codes, and organize all your shortened links from one dashboard.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="max-w-5xl mx-auto px-4 py-24"
    >
      {/* Header */}
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-bold">
          How It Works
        </h2>

        <p className="mt-4 text-[var(--muted)] max-w-2xl mx-auto">
          Create, shorten, and manage your links in just three simple steps.
        </p>
      </div>

      <div className="space-y-12 md:space-y-16">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="flex items-stretch gap-6 md:gap-8"
            >
              {/* Timeline */}
              <div className="flex flex-col items-center shrink-0">

                {/* Circle */}
                <div
                  className="
                    w-14 h-14
                    md:w-16 md:h-16
                    rounded-full
                    bg-[var(--bg)]
                    border-2
                    border-[var(--accent)]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Icon className="text-lg md:text-xl text-[var(--accent)]" />
                </div>

                

              </div>

              {/* Card */}
              <div
                className="
                  flex-1
                  rounded-2xl
                  border
                  border-[var(--border)]
                  bg-[var(--card)]
                  p-6
                  md:p-8
                  transition-all
                  duration-300
                  hover:border-[var(--accent)]
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                <span className="text-sm font-semibold text-[var(--accent)]">
                  Step {index + 1}
                </span>

                <h3 className="mt-2 text-xl md:text-2xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-4 leading-7 text-[var(--muted)]">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}