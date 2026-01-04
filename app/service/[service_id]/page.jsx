import ServiceDetailClient from "./ServiceDetailClient";

// All 14 services data
const allServices = [
  // Baby Care Services (1-5)
  {
    id: 1,
    category: "Baby Care",
    icon: "Baby",
    title: "Professional Baby Care",
    shortDesc: "Certified babysitters for infants and toddlers",
    description: "Our professional baby care service provides experienced and certified babysitters who understand child development and provide age-appropriate activities, ensuring your little ones are safe, happy, and engaged.",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop",
    price: "৳500/hour",
    features: [
      "Certified and background-verified caregivers",
      "Age-appropriate activities and educational games",
      "Meal preparation and feeding assistance",
      "Sleep routine management",
      "Safety-focused environment",
      "Regular updates to parents",
      "First aid certified",
      "Flexible scheduling"
    ],
    includes: ["Diaper changing", "Bottle feeding", "Playtime activities", "Safety monitoring"],
    duration: "Minimum 4 hours",
    availability: "24/7 Available"
  },
  {
    id: 2,
    category: "Baby Care",
    icon: "Baby",
    title: "Newborn Care Specialist",
    shortDesc: "Expert care for newborns 0-3 months",
    description: "Specialized newborn care with trained professionals who understand the unique needs of infants, including feeding schedules, sleep training, and developmental milestones.",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=600&fit=crop",
    price: "৳700/hour",
    features: [
      "Newborn sleep training expertise",
      "Breastfeeding and bottle feeding support",
      "Umbilical cord care",
      "Bathing and hygiene",
      "Growth monitoring",
      "Parent education and guidance",
      "Night nurse available",
      "Postpartum mother support"
    ],
    includes: ["Sleep schedule", "Feeding log", "Development tracking", "Parent coaching"],
    duration: "Minimum 6 hours",
    availability: "24/7 Available"
  },
  {
    id: 3,
    category: "Baby Care",
    icon: "Baby",
    title: "After School Care",
    shortDesc: "Care for school-age children",
    description: "Safe and engaging after-school care with homework help, activities, and healthy snacks for children aged 5-12 years.",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop",
    price: "৳450/hour",
    features: [
      "Homework assistance",
      "Creative activities and crafts",
      "Outdoor play supervision",
      "Snack preparation",
      "Transportation from school available",
      "Social skills development",
      "Screen time management",
      "Extracurricular activity support"
    ],
    includes: ["Pick-up service", "Homework help", "Snacks", "Activity planning"],
    duration: "Minimum 2 hours",
    availability: "Weekdays 2pm-8pm"
  },
  {
    id: 4,
    category: "Baby Care",
    icon: "Baby",
    title: "Special Needs Child Care",
    shortDesc: "Specialized care for children with special needs",
    description: "Compassionate and trained caregivers experienced in working with children with special needs, autism, ADHD, and developmental delays.",
    image: "https://images.unsplash.com/photo-1612924623499-7aaef4ecd1bb?w=800&h=600&fit=crop",
    price: "৳800/hour",
    features: [
      "Special needs training certified",
      "Behavioral therapy support",
      "Sensory activity planning",
      "Communication assistance",
      "Individualized care plans",
      "Medical equipment familiarity",
      "Patience and understanding",
      "Family collaboration"
    ],
    includes: ["Custom care plan", "Progress reports", "Therapy coordination", "Parent support"],
    duration: "Minimum 4 hours",
    availability: "7 days a week"
  },
  {
    id: 5,
    category: "Baby Care",
    icon: "Baby",
    title: "Weekend Babysitting",
    shortDesc: "Flexible weekend childcare",
    description: "Reliable weekend babysitting services so parents can enjoy personal time, date nights, or complete errands stress-free.",
    image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&h=600&fit=crop",
    price: "৳550/hour",
    features: [
      "Fun weekend activities",
      "Indoor and outdoor games",
      "Movie time and entertainment",
      "Meal and snack preparation",
      "Bedtime routine management",
      "Multiple children care",
      "Last-minute booking available",
      "Trusted and reliable sitters"
    ],
    includes: ["Activity planning", "Meals", "Entertainment", "Photos/updates"],
    duration: "Minimum 3 hours",
    availability: "Weekends & Holidays"
  },
  // Elderly Care Services (6-10)
  {
    id: 6,
    category: "Elderly Care",
    icon: "Heart",
    title: "Senior Companion Care",
    shortDesc: "Companionship and daily living assistance",
    description: "Compassionate companions who provide emotional support, conversation, and assistance with daily routines for seniors.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop",
    price: "৳600/hour",
    features: [
      "Friendly companionship",
      "Conversation and social engagement",
      "Light housekeeping",
      "Meal preparation assistance",
      "Medication reminders",
      "Appointment accompaniment",
      "Shopping assistance",
      "Mobility support"
    ],
    includes: ["Daily check-ins", "Activity companionship", "Meal prep", "Light cleaning"],
    duration: "Minimum 4 hours",
    availability: "7 days a week"
  },
  {
    id: 7,
    category: "Elderly Care",
    icon: "Heart",
    title: "Dementia & Alzheimer's Care",
    shortDesc: "Specialized memory care",
    description: "Expert care for seniors with dementia, Alzheimer's, or other memory-related conditions with trained and patient caregivers.",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=600&fit=crop",
    price: "৳750/hour",
    features: [
      "Memory care training",
      "Cognitive stimulation activities",
      "Safety and wandering prevention",
      "Routine establishment",
      "Behavioral management",
      "Family communication",
      "Patience and understanding",
      "24/7 supervision available"
    ],
    includes: ["Safety monitoring", "Cognitive games", "Routine care", "Family updates"],
    duration: "Minimum 6 hours",
    availability: "24/7 Available"
  },
  {
    id: 8,
    category: "Elderly Care",
    icon: "Heart",
    title: "Post-Hospitalization Care",
    shortDesc: "Recovery support after hospital discharge",
    description: "Comprehensive care for seniors recovering from hospitalization, surgery, or illness, ensuring smooth transition home.",
    image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&h=600&fit=crop",
    price: "৳700/hour",
    features: [
      "Post-operative care",
      "Medication management",
      "Wound care assistance",
      "Physical therapy support",
      "Doctor's orders follow-up",
      "Nutrition monitoring",
      "Mobility assistance",
      "Health vitals tracking"
    ],
    includes: ["Recovery monitoring", "Medication tracking", "Appointment coordination", "Vital checks"],
    duration: "Minimum 6 hours",
    availability: "7 days a week"
  },
  {
    id: 9,
    category: "Elderly Care",
    icon: "Heart",
    title: "Respite Care for Family",
    shortDesc: "Temporary relief for family caregivers",
    description: "Professional temporary care giving family caregivers much-needed breaks while ensuring loved ones receive quality care.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop",
    price: "৳650/hour",
    features: [
      "Flexible scheduling",
      "Short-term and long-term options",
      "Continuation of care routines",
      "Family caregiver training",
      "Emergency respite available",
      "Overnight care options",
      "Activity engagement",
      "Detailed care reports"
    ],
    includes: ["Care continuity", "Activity engagement", "Meal service", "Family coordination"],
    duration: "Minimum 4 hours",
    availability: "Flexible scheduling"
  },
  {
    id: 10,
    category: "Elderly Care",
    icon: "Heart",
    title: "24/7 Live-in Care",
    shortDesc: "Round-the-clock senior care",
    description: "Dedicated live-in caregivers providing 24/7 support and companionship for seniors requiring constant assistance.",
    image: "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=800&h=600&fit=crop",
    price: "৳12,000/day",
    features: [
      "24-hour presence",
      "All daily living assistance",
      "Overnight monitoring",
      "Meal preparation all day",
      "Medication management",
      "Emergency response",
      "Companionship anytime",
      "Household light duties"
    ],
    includes: ["24/7 care", "All meals", "Night monitoring", "Emergency support"],
    duration: "Minimum 7 days",
    availability: "24/7 Service"
  },
  // Medical/Special Care Services (11-14)
  {
    id: 11,
    category: "Special Care",
    icon: "Activity",
    title: "Nursing Care at Home",
    shortDesc: "Professional nursing services",
    description: "Registered nurses providing skilled medical care at home including wound care, injections, IV therapy, and health monitoring.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    price: "৳900/hour",
    features: [
      "Registered nurse care",
      "Wound care and dressing",
      "IV therapy administration",
      "Injection services",
      "Catheter care",
      "Vital signs monitoring",
      "Medical equipment operation",
      "Doctor coordination"
    ],
    includes: ["Nursing assessment", "Treatment administration", "Health monitoring", "Medical reports"],
    duration: "Minimum 2 hours",
    availability: "24/7 Available"
  },
  {
    id: 12,
    category: "Special Care",
    icon: "Stethoscope",
    title: "Chronic Disease Management",
    shortDesc: "Long-term illness support",
    description: "Comprehensive care for patients with chronic conditions like diabetes, heart disease, COPD, requiring ongoing medical attention.",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=600&fit=crop",
    price: "৳850/hour",
    features: [
      "Disease-specific training",
      "Medication management",
      "Symptom monitoring",
      "Diet and nutrition support",
      "Exercise assistance",
      "Blood sugar/pressure checks",
      "Doctor appointment coordination",
      "Emergency protocol"
    ],
    includes: ["Health tracking", "Medication schedule", "Diet planning", "Medical coordination"],
    duration: "Minimum 4 hours",
    availability: "7 days a week"
  },
  {
    id: 13,
    category: "Special Care",
    icon: "Activity",
    title: "Physiotherapy Support",
    shortDesc: "Physical therapy assistance",
    description: "Trained assistants supporting physiotherapy exercises, mobility improvement, and rehabilitation programs at home.",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop",
    price: "৳700/hour",
    features: [
      "Exercise assistance",
      "Mobility training",
      "Strength building support",
      "Range of motion exercises",
      "Equipment setup",
      "Progress tracking",
      "Fall prevention",
      "Pain management support"
    ],
    includes: ["Exercise support", "Mobility aids", "Progress reports", "Safety monitoring"],
    duration: "Minimum 1 hour",
    availability: "Weekdays"
  },
  {
    id: 14,
    category: "Special Care",
    icon: "Activity",
    title: "Palliative & Hospice Care",
    shortDesc: "Comfort care for serious illness",
    description: "Compassionate end-of-life care focusing on comfort, dignity, and quality of life for patients with terminal illnesses.",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=600&fit=crop",
    price: "৳1,000/hour",
    features: [
      "Pain management support",
      "Comfort measures",
      "Emotional support",
      "Spiritual care coordination",
      "Family support services",
      "Symptom management",
      "Dignity and respect focus",
      "24/7 on-call support"
    ],
    includes: ["Comfort care", "Emotional support", "Family guidance", "24/7 availability"],
    duration: "Customizable",
    availability: "24/7 Service"
  }
];

// ✅ Generate dynamic metadata (Server Component feature)
export async function generateMetadata({ params }) {
  const { service_id } = await params;
  const service = allServices.find(s => s.id === parseInt(service_id));
  
  if (!service) {
    return {
      title: 'Service Not Found - CareNest',
      description: 'The requested service could not be found.'
    };
  }

  return {
    title: `${service.title} - ${service.price} | CareNest`,
    description: `${service.shortDesc}. ${service.description.substring(0, 150)}...`,
    keywords: `${service.title}, ${service.category}, caregiving, home care, Bangladesh, ${service.title.toLowerCase()}`,
    openGraph: {
      title: `${service.title} - CareNest`,
      description: service.shortDesc,
      images: [service.image],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} - CareNest`,
      description: service.shortDesc,
      images: [service.image],
    }
  };
}

// Server Component - passes data to Client Component
export default async function ServiceDetailPage({ params }) {
  const { service_id } = await params;
  const service = allServices.find(s => s.id === parseInt(service_id)) || allServices[0];

  return <ServiceDetailClient service={service} />;
}