// import { createGateway } from '@ai-sdk/gateway';
export const getEmbeddingModel = () => {

    console.log(process.env.GOOGLE_GENERATIVE_AI_API_KEY)

// const gateway = createGateway({
//   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// });

// return gateway.textEmbeddingModel('text-embedding-004')
return 'text-embedding-005'
}