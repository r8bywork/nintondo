interface TextProps {
	text: string;
}

const Text = ({ text }: TextProps) => {
	return (
		<span className="bg-black text-white text-center font-inconsolata text-4xl font-bold leading-normal">
			{text}
		</span>
	);
};

export default Text;
