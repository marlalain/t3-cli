import inquirer from 'inquirer';

export const confirmPrompt = async (question: string, defaultOption = true) => {
	const { confirm } = await inquirer.prompt<{ confirm: boolean }>({
		type: 'confirm',
		name: 'confirm',
		message: question,
		default: defaultOption,
	});

	return confirm;
};
