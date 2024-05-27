import { Link, useLocation } from "react-router-dom";

export default function Result() {
	const location = useLocation();
	const { image } = location.state;

	function removeQuotes(str: string): string {
		return str.replace(/^"|"$/g, "");
	}

	if (!image) {
		return <p>Encountered an error!</p>;
	}
	return (
		<div className='app'>
			<h2 className='title'>Your image has been generated!</h2>

			<Link to={`${removeQuotes(image)}`} className='downloadLink'>
				Download image
			</Link>
		</div>
	);
}