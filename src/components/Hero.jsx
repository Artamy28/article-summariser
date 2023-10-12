import "./Hero.css";
import { logo } from "../assets";

const Hero = () => {
	return (
		<header>
			<nav>
				<img src={logo} alt="sumz_logo" />
				<button
					type="button"
					onClick={() => {
						window.open("https://github.com/Artamy28?tab=repositories");
					}}
					className="black-button"
				>
					GitHub
				</button>
			</nav>

			<h1 className="head-text">
				Summarize Articles with <br />
				<span className="orange-gradient">OpenAI GPT-4</span>
			</h1>
			<h2 className="desc">
				Simplify your reading with this article summarizer that transforms
				lengthy articles into clear and concise summaries
			</h2>
		</header>
	);
};

export default Hero;
