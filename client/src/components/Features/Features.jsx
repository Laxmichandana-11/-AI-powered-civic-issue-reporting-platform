import {
  FaRobot,
  FaMapMarkedAlt,
  FaCamera,
  FaChartLine,
  FaBell,
  FaBolt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaRobot />,
    title: "AI Detection",
    description:
      "Automatically classify civic issues using artificial intelligence.",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Live Location",
    description:
      "Capture GPS location automatically while reporting an issue.",
  },
  {
    icon: <FaCamera />,
    title: "Photo Upload",
    description:
      "Upload images to provide visual evidence of the reported problem.",
  },
  {
    icon: <FaChartLine />,
    title: "Issue Dashboard",
    description:
      "Track every issue you've reported in one personalized dashboard.",
  },
  {
    icon: <FaBell />,
    title: "Status Updates",
    description:
      "Receive notifications whenever your issue status changes.",
  },
  {
    icon: <FaBolt />,
    title: "Quick Reporting",
    description:
      "Submit civic issues in less than a minute with a simple workflow.",
  },
];

function Features() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800">
          Powerful Features
        </h2>

        <p className="text-center text-gray-500 mt-4 max-w-2xl mx-auto">
          CiviQ combines Artificial Intelligence, location services, and a
          modern dashboard to make civic issue reporting simple and efficient.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-slate-50 rounded-xl p-8 shadow-sm hover:shadow-lg transition duration-300"
            >
              <div className="text-4xl text-blue-600 mb-5">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-7">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;