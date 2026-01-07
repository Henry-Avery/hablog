// Timeline data configuration file
// Used to manage data for the timeline page

export interface TimelineItem {
	id: string;
	title: string;
	description: string;
	type: "education" | "work" | "project" | "achievement";
	startDate: string;
	endDate?: string; // If empty, it means current
	location?: string;
	organization?: string;
	position?: string;
	skills?: string[];
	achievements?: string[];
	links?: {
		name: string;
		url: string;
		type: "website" | "certificate" | "project" | "other";
	}[];
	color?: string;
	featured?: boolean;
}

export const timelineData: TimelineItem[] = [
	{
		id: "astrokeys-development",
		title: "Astrokeys Blog Development",
		description:
			"Building a modern blog with Astro 5, Tailwind CSS v4, and Keystatic CMS. Features include gradient buttons, OKLCH colors, and full-text search.",
		type: "project",
		startDate: "2026-01-01",
		skills: ["Astro", "TypeScript", "Tailwind CSS v4", "Keystatic", "Pagefind"],
		achievements: [
			"Mastered Astro 5 static site generation",
			"Implemented Git-based CMS with Keystatic",
			"Learned OKLCH color system and modern CSS",
		],
		color: "#7C3AED",
		featured: true,
	},
	{
		id: "web-dev-learning",
		title: "Full-Stack Web Development",
		description:
			"Learning modern web development technologies and building projects to practice skills.",
		type: "education",
		startDate: "2025-06-01",
		organization: "Self-taught",
		skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
		achievements: [
			"Completed multiple online courses",
			"Built several personal projects",
			"Learned version control with Git",
		],
		color: "#059669",
	},
	{
		id: "first-website",
		title: "First Website Project",
		description:
			"Created my first website using HTML, CSS, and JavaScript. This was the beginning of my web development journey.",
		type: "achievement",
		startDate: "2025-03-15",
		endDate: "2025-04-01",
		skills: ["HTML", "CSS", "JavaScript"],
		achievements: [
			'Successfully launched first "Hello World" website',
			"Learned responsive design basics",
			"Developed passion for web development",
		],
		color: "#2563EB",
	},
];

// Get timeline statistics
export const getTimelineStats = () => {
	const total = timelineData.length;
	const byType = {
		education: timelineData.filter((item) => item.type === "education").length,
		work: timelineData.filter((item) => item.type === "work").length,
		project: timelineData.filter((item) => item.type === "project").length,
		achievement: timelineData.filter((item) => item.type === "achievement").length,
	};

	return { total, byType };
};

// Get timeline items by type (sorted by start date, newest first)
export const getTimelineByType = (type?: string) => {
	if (!type || type === "all") {
		return timelineData.sort(
			(a, b) =>
				new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
		);
	}
	return timelineData
		.filter((item) => item.type === type)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
		);
};

// Get featured timeline items
export const getFeaturedTimeline = () => {
	return timelineData
		.filter((item) => item.featured)
		.sort(
			(a, b) =>
				new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
		);
};

// Get current ongoing items
export const getCurrentItems = () => {
	return timelineData.filter((item) => !item.endDate);
};

// Calculate total work experience
export const getTotalWorkExperience = () => {
	const workItems = timelineData.filter((item) => item.type === "work");
	let totalMonths = 0;

	workItems.forEach((item) => {
		const startDate = new Date(item.startDate);
		const endDate = item.endDate ? new Date(item.endDate) : new Date();
		const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
		const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
		totalMonths += diffMonths;
	});

	return {
		years: Math.floor(totalMonths / 12),
		months: totalMonths % 12,
	};
};
