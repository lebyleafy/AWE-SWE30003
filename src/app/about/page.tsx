export default function AboutPage() {
  const team = [
    {
      name: "Member 1",
      role: "Project Leader",
      image: "/images/team1.jpg",
      description:
        "Responsible for planning, coordinating, and ensuring the project meets all requirements and deadlines.",
      email: "trung@example.com",
    },
    {
      name: "Member 2",
      role: "Frontend Developer",
      image: "/images/team2.jpg",
      description:
        "Focuses on building responsive and user-friendly interfaces using React and TailwindCSS.",
      email: "member2@example.com",
    },
    {
      name: "Member 3",
      role: "Backend Developer",
      image: "/images/team3.jpg",
      description:
        "Handles server-side logic, APIs, authentication, and database operations using Prisma and PostgreSQL.",
      email: "member3@example.com",
    },
    {
      name: "Member 4",
      role: "UI/UX Designer",
      image: "/images/team4.jpg",
      description:
        "Designs wireframes, user flows, and high-quality layouts to ensure a seamless user experience.",
      email: "member4@example.com",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      {/* Title Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">About Our Team</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We are a dedicated team of developers and designers working together
          to build a high-quality online electronics store with modern web
          technologies.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {team.map((member) => (
          <div
            key={member.email}
            className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
            />

            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-blue-600 font-medium">{member.role}</p>

            <p className="text-gray-600 mt-3 text-sm">{member.description}</p>

            <a
              href={`mailto:${member.email}`}
              className="mt-4 inline-block text-blue-700 hover:underline text-sm"
            >
              Contact
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
