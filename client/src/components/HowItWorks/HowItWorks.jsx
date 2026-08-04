import {
  FaCamera,
  FaRobot,
  FaMapMarkerAlt,
  FaBuilding,
  FaCheckCircle,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaCamera />,
    title: "Upload a Photo",
    description:
      "Capture or upload an image of the civic issue directly from your device.",
  },
  {
    icon: <FaRobot />,
    title: "AI Analysis",
    description:
      "Our AI identifies the issue category and prepares the report automatically.",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Location Detection",
    description:
      "The system records the exact GPS location of the reported issue.",
  },
  {
    icon: <FaBuilding />,
    title: "Authority Notification",
    description:
      "The report is forwarded to the relevant municipal department.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Track Resolution",
    description:
      "Monitor the issue status until it has been resolved.",
  },
];

function HowItWorks() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center text-gray-800">
          How CiviQ Works
        </h2>

        <p className="text-center text-gray-500 mt-4 max-w-2xl mx-auto">
          Reporting civic issues is quick and simple. Follow these five easy
          steps to help improve your community.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-5">

          {steps.map((step, index) => (
            <div
              key={step.title}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition duration-300"
            >
              <div className="text-5xl text-blue-600 flex justify-center mb-5">
                {step.icon}
              </div>

              <h3 className="text-xl font-semibold mb-3">
                {index + 1}. {step.title}
              </h3>

              <p className="text-gray-600 text-sm leading-6">
                {step.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;