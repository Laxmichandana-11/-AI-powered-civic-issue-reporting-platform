const stats = [
  {
    value: "12K+",
    label: "Issues Reported",
  },
  {
    value: "98%",
    label: "Resolution Rate",
  },
  {
    value: "50+",
    label: "Connected Cities",
  },
  {
    value: "20K+",
    label: "Active Citizens",
  },
];

function Statistics() {
  return (
    <section className="bg-blue-600 py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-white text-center">
          CiviQ in Numbers
        </h2>

        <p className="text-blue-100 text-center mt-4 max-w-2xl mx-auto">
          Together, citizens and local authorities can build cleaner,
          safer and smarter communities.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14">

          {stats.map((item) => (
            <div
              key={item.label}
              className="text-center"
            >
              <h3 className="text-5xl font-bold text-white">
                {item.value}
              </h3>

              <p className="text-blue-100 mt-3">
                {item.label}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Statistics;