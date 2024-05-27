import { cloud, inflight, lift, main } from "@wingcloud/framework";
import Vite from "@winglibs/vite";
import Replicate from "replicate";

main((root) => {
	const api = new cloud.Api(root, "api", { cors: true })

	const secret = new cloud.Secret(root, "ReplicateAPIToken", {
		name: "replicate-api-token",
	});


	api.post(
		"/generate",
		lift({ secret })
			.grant({ secret: ["value"] })
			.inflight(async (ctx, request) => {
			const REPLICATE_API_TOKEN = await ctx.secret.value();
			const STABILITY_URI = "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc"
			const FACESWAP_URI = "omniedgeio/face-swap:c2d783366e8d32e6e82c40682fab6b4c23b9c6eff2692c0cf7585fc16c238cfe"

			const replicate = new Replicate({ auth: REPLICATE_API_TOKEN });

			const { userPrompt, gender, image } = JSON.parse(request.body!);

			const generateImageSpecs = {
				width: 768,
				height: 768,
				prompt: `${
					userPrompt
						? userPrompt
						: `A professional ${gender} portrait suitable for a social media avatar. Please ensure the image is appropriate for all audiences.`
				}`,
				refine: "expert_ensemble_refiner",
				apply_watermark: false,
				num_inference_steps: 25,
			};

			const generatedImageArray = await replicate.run(STABILITY_URI,
				{ input: generateImageSpecs }
			);

			if (!generatedImageArray[0]) throw new Error("No image generated");

			const imageSwapSpecs = {
				swap_image: image,
				target_image: generatedImageArray[0],
			};

			const output = await replicate.run(FACESWAP_URI,
				{ input: imageSwapSpecs }
			);
			console.log(output);
			if (!output[0]) throw new Error("Image swapping failed");

			return {
				status: 200,
				body: JSON.stringify(output),
			};
		})
	);

	new Vite.Vite(root, "Vite", {
		root: "../frontend",
		publicEnv: {
			apiUrl: api.url,
		},
	});
});