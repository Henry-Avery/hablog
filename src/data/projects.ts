// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image?: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	visitUrl?: string;
}

export const projectsData: Project[] = [
	{
		id: "astrokeys-blog",
		title: "Astrokeys Blog",
		description:
			"Modern blog built with Astro 5, Tailwind CSS v4, and Keystatic CMS. Features gradient buttons, OKLCH colors, and full-text search with Pagefind.",
		category: "web",
		techStack: ["Astro", "TypeScript", "Tailwind CSS v4", "Keystatic", "Pagefind"],
		status: "in-progress",
		sourceCode: "https://github.com/yourusername/astrokeys",
		startDate: "2026-01-01",
		featured: true,
		tags: ["Blog", "CMS", "Open Source"],
	},
	{
		id: "example-portfolio",
		title: "Personal Portfolio",
		description:
			"Personal portfolio website showcasing project experience and technical skills.",
		category: "web",
		techStack: ["React", "Next.js", "TypeScript", "Framer Motion"],
		status: "completed",
		liveDemo: "https://portfolio.example.com",
		sourceCode: "https://github.com/example/portfolio",
		visitUrl: "https://portfolio.example.com",
		startDate: "2023-09-01",
		endDate: "2023-12-01",
		featured: true,
		tags: ["Portfolio", "React", "Animation"],
	},
	{
		id: "task-manager",
		title: "Task Manager App",
		description:
			"Cross-platform task management application supporting team collaboration and project management.",
		category: "mobile",
		techStack: ["React Native", "TypeScript", "Redux", "Firebase"],
		status: "planned",
		startDate: "2024-03-01",
		tags: ["Mobile", "Productivity", "Team Collaboration"],
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter(
		(p) => p.status === "completed",
	).length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
};
