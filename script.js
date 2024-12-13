const typing_form = document.querySelector(".typing_form")


const chat_list = document.querySelector(".chat_list")


const API_Key = "AIzaSyDR-D4S2CbPRFrx6V4FK-Ta10gdS1AIh_Q";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_Key}`;



const showTypingEffect = (text , textElement) => {
    const words = text.split(" ")
    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
        textElement.innerText += (currentWordIndex === 0 ? "" : " ") + words[currentWordIndex++]
        if(currentWordIndex === words.length){
            clearInterval(typingInterval)
        }

        window.scrollTo(0 , chat_list.scrollHeight)
    }, 75);
}

const genrateAPIResponse = async (div) =>{
    const textElement = div.querySelector(".text");

    try{
        const response = await fetch(API_URL , {
            method: "POST",
            headers:{"content-Type" : "application/json"},
            body:JSON.stringify({
                contents:[{
                    role:"user",
                    parts:[{text: userMessage}]
                }]
            })
        })


        const data = await response.json()
        const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1')

        console.log(apiResponse);

        showTypingEffect(apiResponse , textElement)
      
        
    }catch(error){
        console.error(error)
    }
    finally{
        div.classList.remove("loading")
    }
}


const copyMessage = (copy_Btn) =>{
    const messageText = copy_Btn.parentElement.querySelector(".text").innerText;

    console.log(messageText);
    
    navigator.clipboard.writeText(messageText)
    copy_Btn.innerText = "done"

    setTimeout(() => copy_Btn.innerText = "content_copy" , 1000)
}



const showLoading = () => {
    const html = `
         <div class="message_content">
                    <img src="images/gemini.svg" alt="">
                    <p class="text"></p>
                    <div class="loading_indicoator">
                        <div class="loading_Bar"></div>
                        <div class="loading_Bar"></div>
                        <div class="loading_Bar"></div>
                    </div>

                    </div>

                    <span onClick="copyMessage(this)" class="material-symbols-outlined">
                        content_copy
                        </span>
    `

    const div = document.createElement("div");
    div.classList.add("message" , "incoming" , "loading");

    div.innerHTML =  html

    chat_list.appendChild(div)

    window.scrollTo(0 , chat_list.scrollHeight)
    genrateAPIResponse(div)
}

const handleOutGoingChat = () =>{

    userMessage = document.querySelector(".typing_input").value;
    console.log(userMessage);

    if(!userMessage) return

    const html = `
                    <div class="message_content">
                        <img src="images/user.jpg" alt="">
                        <p class="text"></p>
                    </div>      

    `

    const div = document.createElement("div");
    div.classList.add("message" , "outgoing");

    div.innerHTML =  html

    div.querySelector(".text").innerHTML = userMessage;

    chat_list.appendChild(div)

    typing_form.reset()

    window.scrollTo(0 , chat_list.scrollHeight)
    setTimeout(showLoading , 500)
       
}



typing_form.addEventListener("submit" , (e) =>{
    e.preventDefault();

    handleOutGoingChat()
})