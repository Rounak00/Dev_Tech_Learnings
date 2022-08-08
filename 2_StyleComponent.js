/*Styled Component:*/
   
//1>  import styled from "styled-components" // this is how you need to import the file first
//2>  example we need to do this <div className="container"> , except this we will do this,
     <Container> (make first later capital so its Styled components make by us)

</Container>
//3>  const Container= styled.div` width:100%; color:red; ` // here styled is div we can write is as span and p and other tags also
//4> NESTING:  now think you have a div and inside that div there is a h1 tag, and that div is your styled component
      
     const header=styled.div`
           background-color: red;
            h1{
               color:white;
               }
            &:hover{  //hover is used for the div
                background-color:black;
                  }
          `  
//5> PROPS: easy just send your style in your tag and catch it in css using &{};
    <Container color="blue">
    const container=styled.div`
            background-color=${(props)=>props.bg};  // we can use as destructure also ${({bg})=>bg}   
             `

//6> THEME PROVIDER:
     
      //1. first import it
         import {ThemeProvider} from "styled-components";

      //2. in app.js we need to wrap components with theme provider
           <ThemeProvider theme={t}>
             <>
                 <p>Hello World</p>
             </>
           </ThemeProvider>
       
      //3. we need to write "t"
           const t={
               color: {
                    color:"red";
                     },
                   };
 
       //4. Now we can access it
               &{(props)=>props.t.color.color}





7> GLOBAL STYLE
    it is just like external css
   import {createGlobalStyle} from "Styled-Components"; //import first

   export const GlobalStyle=createGlobalStyle`
     // your style
     `
  
    >> now in working file first import {globalstyle} from "./globalstyle";
    >> then <globalstyle> add this in inside of <ThemeProvider> tag at top 


