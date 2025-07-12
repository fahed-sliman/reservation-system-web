
import { FaCalendarCheck, FaHeadset, FaShieldAlt, FaStar } from "react-icons/fa";
const WhyChooseUs = () => {
    const features = [
        {
            icon: <FaShieldAlt size={32} />,
            title: 'تقييمات موثوقة',
            description: 'نعتمد على تقييمات حقيقية من مستخدمين مثلك لتضمن الشفافية والمصداقية.'
        },
        {
            icon: <FaStar size={32} />,
            title: 'جودة لا تضاهى',
            description: 'نختار لك فقط أفضل الوجهات والأماكن التي تلبي أعلى معايير الجودة والتميز.'
        },
        {
            icon: <FaCalendarCheck size={32} />,
            title: 'حجز فوري وسهل',
            description: 'نظام حجز بسيط وآمن يتيح لك تأكيد حجوزاتك في دقائق معدودة وبدون أي تعقيدات.'
        },
        {
            icon: <FaHeadset size={32} />,
            title: 'دعم فني 24/7',
            description: 'فريق دعم متخصص جاهز لمساعدتك في أي وقت والإجابة على جميع استفساراتك.'
        }
    ];

    return (
        <section className="py-24 bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                        لماذا تختار منصتنا؟
                    </h2>
                    <p className="text-gray-400 mt-4 text-lg max-w-3xl mx-auto">
                        نحن لا نقدم لك مجرد خدمة، بل نمنحك تجربة متكاملة وموثوقة من البداية إلى النهاية.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {features.map(feature => (
                        <div key={feature.title} className="bg-gray-900 p-8 rounded-lg text-center transform transition-transform duration-300 hover:-translate-y-2">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500/20 text-orange-400 mx-auto mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;