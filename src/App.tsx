import "./App.css";
import WalletIcon from "./assets/wallet.svg?react";
import Button from "./components/Button/Button";
import Header from "./components/Header/Header";
import Text from "./components/Text/Text";

const buttons = [
	{ text: "Wallet", svg: WalletIcon, url: "/wallet" },
	{ text: "Wallet", svg: WalletIcon, url: "/wallet" },
	{ text: "Wallet", svg: WalletIcon, url: "/wallet" },
];

const App = () => {
	return (
		<div className="App">
			<Header />
			<div className="max-w-6xl mx-auto text-center flex flex-col justify-center h-screen">
				<div>
					<Text />
				</div>
				<div className="flex">
					{buttons.map((button, index) => (
						<Button
							key={index}
							text={button.text}
							SvgIcon={button.svg}
							url={button.url}
							className={"[&:not(:last-child)]:mr-16"}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
export default App;
