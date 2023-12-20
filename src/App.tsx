import "./App.css";
import WalletIcon from "./assets/wallet.svg?react";
import Button from "./components/Button/Button";
import Header from "./components/Header/Header";
import Text from "./components/Text/Text";

const buttons = [
	{ text: "Wallet", svg: WalletIcon, url: "/wallet" },
	// { text: "Profile", svg: <ProfileIcon />, url: "/profile" },
	// add more button objects here...
];

const App = () => {
	return (
		<div className="App">
			<Header />
			<div>
				<Text text={"Cryptocurrency based on the game Animal Crossing"} />
				{buttons.map((button, index) => (
					<Button
						key={index}
						text={button.text}
						SvgIcon={button.svg}
						url={button.url}
					/>
				))}
			</div>
		</div>
	);
};

export default App;
