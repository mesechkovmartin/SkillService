import { FaSearch, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

export default function HowItWorks() {
     const steps = [
        {
            number: "1",
            icon: FaSearch,
            title: "Find an Expert",
            description: "Browse professionals in your city.",
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            number: "2",
            icon: FaCalendarAlt,
            title: "Book Appointment",
            description: "Choose a convenient time and contact directly.",
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
        {
            number: "3",
            icon: FaCheckCircle,
            title: "Enjoy Service",
            description: "Get quality service from a trusted professional.",
            color: "text-green-600",
            bg: "bg-green-100",
        },
    ];

    return (
        <section className="py-16">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                <p className="text-lg text-gray-500">
                    Get the service you need in three simple steps
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {steps.map((step) => {
                    const Icon = step.icon;

                    return (
                        <div key={step.number} className="text-center">
                            <div className="flex justify-center items-center mb-8">
                                <div className="w-14 h-14 rounded-full bg-base-200 flex items-center justify-center text-lg">
                                    {step.number}
                                </div>

                                <div className={`w-24 h-24 rounded-2xl ${step.bg} flex items-center justify-center -ml-2`}>
                                    <Icon className={step.color} size={40} />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-4">
                                {step.title}
                            </h3>

                            <p className="text-gray-500 text-lg">
                                {step.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}