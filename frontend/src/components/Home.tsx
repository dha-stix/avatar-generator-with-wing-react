import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const [selectedFile, setSelectedFile] = useState<string | null | ArrayBuffer>(
		null
	);
	const [gender, setGender] = useState<string>("");
	const [userPrompt, setUserPrompt] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const file = e.target.files[0];
			const reader = new FileReader();
			reader.onloadend = () => {
				setSelectedFile(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (!selectedFile) return;
			const result = await fetch(`${window.wing.env.apiUrl}/generate`, {
				method: "POST",
				body: JSON.stringify({
					gender,
					userPrompt,
					image: selectedFile,
				}),
			});
			if (result.ok) {
				const response = await result.text();
				setLoading(false);
				alert("Image generated successfully");
				navigate("/result", { state: { image: response } });
			}
		} catch (err) {
			console.error({ err });
			alert("Encountered an Error! ❌")
		}
	};

	return (
		<div className='app'>
			<h1 className='title'>Generate Avatars in seconds</h1>
			<form className='form' onSubmit={handleFormSubmit}>

				<label htmlFor='gender'>Gender</label>

				<select
					className='genderInput input'
					name='gender'
					id='gender'
					value={gender}
					onChange={(e) => setGender(e.target.value)}
					required
				>
					<option value=''>Select</option>
					<option value='male'>Male</option>
					<option value='female'>Female</option>
				</select>

				<label htmlFor='image'>Upload your picture</label>
				<input
					name='image'
					type='file'
					accept='.png, .jpg, .jpeg'
					required
					onChange={handleFileChange}
				/>

				<label htmlFor='prompt'>
					Add custom prompt for your avatar{" "}
					<span className='opacity-60'>(optional)</span>
				</label>
				<textarea
					rows={5}
					name='prompt'
					className='textInput'
					id='prompt'
					value={userPrompt}
					placeholder='Copy image prompts from https://lexica.art'
					onChange={(e) => setUserPrompt(e.target.value)}
				/>

				<button disabled={loading}>
					{loading ? "Generating image..." : "Generate Avatar"}
				</button>
			</form>
		</div>
	);
}
