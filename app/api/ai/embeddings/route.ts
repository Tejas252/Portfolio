import { embedMany, generateText } from 'ai';
import { google } from "@ai-sdk/google"
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import pdfParse from 'pdf-parse/lib/pdf-parse'// Make sure to install: npm install pdf-parse
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { CONTENT_DIVIDER_PROMPT } from '@/prompt/content_devider';
import { smartChunkingForAIStructuring } from '@/lib/splitter';
import { extractJsonFromText } from '@/lib/parser';


export const GET = async (request: NextRequest) => {

    const text = [
        "Tejas Savaliya, MERN Stack developer, he know the nextjs too & he has 2 years of experiance with nextjs currently he is working on a AI project OSSPhere",
        "Tejas Savaliya worekd on three project \n 1: Designtrack - CRM for showrooms management specially for furniture showrooms \n 2: Daring APP Backend - here he created backaend for a dating app, used tech socket.io \n 3: LOKO- Taxi hailing platform & Food delivery like zomato there are customer can order the food and LOKO delivery partner pick up & drop that food at customer address"]

    const { embeddings } = await embedMany({
        model: google.textEmbeddingModel('text-embedding-004'),
        values: text,
    });

    console.log("🚀 ~ GET ~ embedding:", embeddings)
    const db = await getDb();
    const collection = db.collection("TejasData");
    console.log("🚀 ~ GET ~ collection:", collection)
    const data = await collection.insertMany(embeddings?.map((d) => ({ ...d, createdAt: new Date() })) || []);
    console.log("🚀 ~ GET ~ data:", data)




    return NextResponse.json(text)
}

export const POST = async (request: NextRequest) => {
    try {

        const formData = await request.formData();


        // ** Get the file
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if(file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // ** Parse the PDF
        const data = await pdfParse(buffer);
        const extractedText = data.text;

        const chunksForAI = smartChunkingForAIStructuring(extractedText);

        // console.log("🚀 ~ POST ~ chunks:", chunks)

        const result = await generateText({
            model: google("models/gemini-2.0-flash-exp"),
            system: CONTENT_DIVIDER_PROMPT,
            prompt: `content: ${chunksForAI.join("\n\n")}`,
        })

       

        // ** Split the text
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        // ** Create a chunks from the extracted text
        const chunks = await splitter.createDocuments([extractJsonFromText(result.text)?.map((chunk: any) => `${chunk.section}: ${chunk.content}`)?.join("\n\n") || ""]);

        console.log("🚀 ~ POST ~ result:", chunks)
        const  embeddings  = await embedMany({
            model: google.textEmbeddingModel('text-embedding-004'),
            values: chunks?.map((chunk) => chunk.pageContent as string),
        });

        const db = await getDb();
        const collection = db.collection("TejasData");
        const insertedData = await collection.insertMany(embeddings?.embeddings?.map((d,i) => ({ embedding: d,value:embeddings.values[i],metadata:chunks[i].metadata, createdAt: new Date() })) || []);


        return NextResponse.json(insertedData)

    } catch (error) {
        console.log("🚀 ~ POST ~ error:", error)
        throw error
    }
}
