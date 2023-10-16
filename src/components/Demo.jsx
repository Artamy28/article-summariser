import "./Demo.css";
import { copy, linkIcon, loader, tick } from "../assets";
import { useState, useEffect } from "react";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
	const [article, setArticle] = useState({
		url: "",
		summary: "",
	});

	const [allArticles, setAllArticles] = useState([]);
	// const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery(); // fetch data using Redux Toolkit
	const [copied, setCopied] = useState("");

	// Rewrite fetch data without Redux Toolkit for practice (and because I don't understand Redux Toolkit)
	const [summary, setSummary] = useState(null);
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState(null);

	const getSummary = async (url) => {
		console.log("getSummary called");

		const dataPromise = async () => {
			const options = {
				method: "GET",
				headers: {
					"X-RapidAPI-Key":
						"c9a48f9518msh829ddbaff478b6dp1c98dfjsn7a66dab412d4",
					"X-RapidAPI-Host": "article-extractor-and-summarizer.p.rapidapi.com",
				},
			};
			const baseURL = "https://article-extractor-and-summarizer.p.rapidapi.com";
			const params = `/summarize?url=${encodeURIComponent(url)}&length=3`;
			const response = await fetch(baseURL + params, options);
			console.log("full url:", baseURL + params);
			const data = await response.json();
			if (!response.ok) throw Error(data.error);
			console.log("data:", data);
			console.log("data typeof:", typeof data);
			return data;
		};

		setIsFetching(true);

		dataPromise()
			.then((data2) => {
				console.log(data2.summary);
				setSummary(data2.summary);
				setIsFetching(false);
				setError(null);

				console.log("im here");
				const newArticle = { ...article, summary: data2.summary };
				const updatedAllArticles = [newArticle, ...allArticles];
				console.log(newArticle);
				console.log(updatedAllArticles);

				setArticle(newArticle);
				setAllArticles(updatedAllArticles);
				localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
			})
			.catch((error) => {
				console.log("Error: ", error.message);
				setIsFetching(false);
				setError(error.message);
			});
	};

	useEffect(() => {
		const articlesFromLocalStorage = JSON.parse(
			localStorage.getItem("articles")
		);

		if (articlesFromLocalStorage) {
			setAllArticles(articlesFromLocalStorage);
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("handleSubmit called");
		// const { data } = await getSummary({ articleUrl: article.url }); // fetch data using Redux Toolkit

		// if (data?.summary) {
		// 	const newArticle = { ...article, summary: data.summary };
		// 	const updatedAllArticles = [newArticle, ...allArticles];

		// 	setArticle(newArticle);
		// 	setAllArticles(updatedAllArticles);
		// 	localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
		// }

		getSummary(article.url);
	};

	const handleCopy = (copyUrl) => {
		setCopied(copyUrl);
		navigator.clipboard.writeText(copyUrl);
		setTimeout(() => setCopied(false), 2000);
	};

	const exampleArticle1 = {
		url: "https://www.bbc.co.uk/news/education-66895259",
		summary:
			'UK Prime Minister Rishi Sunak is reportedly considering a reform of the school system in England that could introduce a new qualification called the "British baccalaureate." The plans may include making the study of maths and English compulsory until the age of 18. However, no final decision has been made, and the proposed changes to A-levels are expected to be controversial. The Labour Party has criticized the proposals as an "undeliverable gimmick," while the government denies that Sunak is seeking radical proposals for political gain. Sunak had previously suggested the idea of a new baccalaureate qualification during his leadership campaign last year and has expressed his desire for all young people to study maths until the age of 18. The Education Policy Institute has called for a new baccalaureate qualification to replace A-levels, stating that A-levels are too narrow and dominant in secondary education. The proposed British baccalaureate would offer a broader curriculum, covering academic, applied, and technical subjects. Education is devolved in Scotland, Wales, and Northern Ireland, so decisions regarding educational reforms are made by the devolved governments in each nation. The proposal for England is being referred to as a British baccalaureate to distinguish it from the existing English baccalaureate at the GCSE level. However, concerns have been raised about the potential impact on teacher recruitment and retention, as well as the increased workload for teachers. The government is already implementing the rollout of T-levels, a new vocational qualification, and has plans to facilitate the study of maths until the age of 18.',
	};

	const exampleArticle2 = {
		url: "https://www.example.com/",
		summary:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget est sed neque pellentesque consequat. Mauris ut varius orci. Fusce congue ante ac vestibulum scelerisque. Sed nibh mauris, venenatis vitae consequat eget, sollicitudin sed risus. Nam congue id orci in lobortis. Maecenas ornare congue turpis in porta. In scelerisque, velit vitae sagittis faucibus, ex risus consectetur nibh, et facilisis nisi nisl vitae nunc. Nullam fermentum, mi vel malesuada porta, odio ligula ultrices elit, vitae sagittis ante massa pellentesque erat. Cras interdum risus nunc, sed euismod velit auctor volutpat. Duis placerat cursus odio non tincidunt. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce maximus est velit, in imperdiet eros volutpat sed. Donec eu purus sapien. Donec erat ex, elementum ut sem a, egestas consequat ligula. In eget enim ante. Nam eu vehicula dolor, sodales tempus dui. Nulla tempus, neque id sollicitudin facilisis, nisi est auctor leo, et blandit eros mauris sed metus. Donec tincidunt, justo eu ultrices elementum, magna nibh dignissim quam, nec convallis erat nulla non odio. In luctus auctor pretium. Quisque lacinia sapien ac tortor congue rhoncus. Phasellus non elit maximus, dictum erat id, rutrum dolor. Pellentesque sed vestibulum orci.",
	};

	return (
		<section>
			{/* Search */}
			<div>
				<form
					onSubmit={(e) => {
						handleSubmit(e);
						setError(null);
					}}
				>
					<img src={linkIcon} alt="link_icon" className="link-icon" />
					<input
						type="url"
						placeholder="Enter a URL"
						value={article.url}
						onChange={(e) => {
							setArticle({
								...article, // Copy the old fields
								url: e.target.value, // But override this one
							});
						}}
						required
						className="url-input"
					/>
					<button type="submit" className="submit-button">
						↵
					</button>
				</form>

				{/* Browse URL History */}
				<div className="url-history">
					{allArticles.map((item, index) => (
						<div
							key={`link-${index}`}
							onClick={() => {
								setArticle(item);
								setError(null);
							}}
							className="link-card"
						>
							<div className="copy-button" onClick={() => handleCopy(item.url)}>
								<img src={copied === item.url ? tick : copy} alt="copy_icon" />
							</div>
							<p className="history-link">{item.url}</p>
						</div>
					))}

					<div
						onClick={() => {
							setArticle(exampleArticle1);
							setError(null);
						}}
						className="link-card"
					>
						<div
							className="copy-button"
							onClick={() => handleCopy(exampleArticle1.url)}
						>
							<img
								src={copied === exampleArticle1.url ? tick : copy}
								alt="copy_icon"
							/>
						</div>
						<p className="history-link">{exampleArticle1.url}</p>
					</div>

					<div
						onClick={() => {
							const exampleArticle2 = {
								url: "https://www.example.com/",
								summary:
									"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget est sed neque pellentesque consequat. Mauris ut varius orci. Fusce congue ante ac vestibulum scelerisque. Sed nibh mauris, venenatis vitae consequat eget, sollicitudin sed risus. Nam congue id orci in lobortis. Maecenas ornare congue turpis in porta. In scelerisque, velit vitae sagittis faucibus, ex risus consectetur nibh, et facilisis nisi nisl vitae nunc. Nullam fermentum, mi vel malesuada porta, odio ligula ultrices elit, vitae sagittis ante massa pellentesque erat. Cras interdum risus nunc, sed euismod velit auctor volutpat. Duis placerat cursus odio non tincidunt. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce maximus est velit, in imperdiet eros volutpat sed. Donec eu purus sapien. Donec erat ex, elementum ut sem a, egestas consequat ligula. In eget enim ante. Nam eu vehicula dolor, sodales tempus dui. Nulla tempus, neque id sollicitudin facilisis, nisi est auctor leo, et blandit eros mauris sed metus. Donec tincidunt, justo eu ultrices elementum, magna nibh dignissim quam, nec convallis erat nulla non odio. In luctus auctor pretium. Quisque lacinia sapien ac tortor congue rhoncus. Phasellus non elit maximus, dictum erat id, rutrum dolor. Pellentesque sed vestibulum orci.",
							};
							setArticle(exampleArticle2);
							setError(null);
						}}
						className="link-card"
					>
						<div
							className="copy-button"
							onClick={() => handleCopy(exampleArticle2.url)}
						>
							<img
								src={copied === exampleArticle2.url ? tick : copy}
								alt="copy_icon"
							/>
						</div>
						<p className="history-link">{exampleArticle2.url}</p>
					</div>
				</div>
			</div>

			{/* Display Results */}
			<div className="results">
				{isFetching && (
					<img src={loader} alt="loading" className="loading"></img>
				)}
				{error && (
					<p className="error-message">
						That wasn't supposed to happen...
						<br />
						<span className="error-data">{error}</span>
					</p>
				)}
				{!isFetching && !error && article.summary && (
					<div className="summary">
						<h2 className="summary-header">
							Article <span className="blue-gradient">Summary</span>
						</h2>
						<div className="summary-box">
							<p className="summary-text">{article.summary}</p>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default Demo;
