import { middlewareAuthPages } from "@/actions/middleware.verifications";


export default async function LayoutPrivate({ children }) {
   await middlewareAuthPages ();
  
    return <>
    {children}</>;
  }
  