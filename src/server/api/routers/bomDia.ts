import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { utapi } from "~/server/uploadthing";

export const bomDiaRouter = createTRPCRouter({
  getLatestBomDia: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.bomDia.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
  createBomDia: publicProcedure.mutation(async ({ ctx }) => {
    console.log("----------------------------------------------------------------");
    console.log("Inside createBomDia");
    console.log("----------------------------------------------------------------");
    console.log("Initializing image generation");
    console.log("----------------------------------------------------------------");
    const imagemDeFundo = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A beautiful landscape",
      n: 1,
      size: "1024x1024",
    });
    
    console.log("Image generation complete");
    console.log("----------------------------------------------------------------");
    
    if (!imagemDeFundo.data[0]) {
      throw new Error("Failed to generate image");
    }
    
    const image_url = imagemDeFundo.data[0].url;
    
    if (!image_url) {
      throw new Error("Failed to generate image");
    }
    
    console.log("Initializing fraseMotivacional generation");
    console.log("----------------------------------------------------------------");
    
    const fraseMotivacional = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Crie uma frase motivacional bem genérica e rasa",
        },
      ],
      model: "gpt-3.5-turbo",
    });
    
    console.log("FraseMotivacional generation complete");
    console.log("----------------------------------------------------------------");
    
    if (!fraseMotivacional.choices[0]) {
      throw new Error("Failed to generate fraseMotivacional");
    }
    
    console.log("Uploading image to UTAPI");
    console.log("----------------------------------------------------------------");
    
    const uploadedFile = await utapi.uploadFilesFromUrl(image_url);
    
    
    console.log("Image uploaded to UTAPI");
    console.log("----------------------------------------------------------------");
    
    console.log("Creating bomDia in database");
    console.log("----------------------------------------------------------------");
    const data = await ctx.db.bomDia.create({
      data: {
        imgaeUrl: uploadedFile.data?.url || "",
        fraseMotivacional: fraseMotivacional.choices[0].message.content || "",
        createdAt: new Date(),
      },
    });
    
    console.log("BomDia created in database");
    console.log("----------------------------------------------------------------");

    // return data;
  }),
});
