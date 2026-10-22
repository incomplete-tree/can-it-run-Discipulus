async function deviceEntered() {
    // hide other stuff
    document.querySelectorAll(".result")
        .forEach(stuff => stuff.style.display = "none");

    const input = document.getElementById("device-enter-input");
    const device = input.value;

    let resolvedDevice = null;
    if (device.includes("smart")) {
        resolvedDevice = "smart-device";
    }
    else{
        const aiWaitingThingy = document.getElementById("ai-waiting-thingy")
        aiWaitingThingy.style.display = "block";
        
        const start = Date.now(); // my ai model said i should use performance.now() but i see no benefit in that

        const response = await getAiResponse(
            `Hello. Please classify '${device}' as one of the following: \ 
            'nintendo-wii-u', \
            'nintendo-3ds', \
            'obviously'(choose this for devices like laptops, desktops, mobile phones, smartwatches that run wearos/watchos, and other devices with a mobile or desktop operating system.), \
            'no-internet' for any device that has no internet \
            or 'other'. Respond with only the classification, repeating the exact ID from this prompt and nothing else.`)
        if (!response){
            aiWaitingThingy.innerHTML = "sadly ai failed so idk, please try again";
        }
        // we'll assume the ai is correct anyway, if you find that AI can make mistakes(unlikely) then please add checks here.
        resolvedDevice = response === "other" ? "cant-run" : response;

        const end = Date.now();

        const interval = end - start;
        

        aiWaitingThingy.style.display = "none";
    }
    
    document.getElementById(resolvedDevice).style.display = "block";
}

// if you want to make this function yourself, use `getAiResponse("Write a javascript function to get api response from google servers thingy.");`
async function getAiResponse(prompt){
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer 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`
        },
        body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [{ role: "user", content: prompt }]
        })
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    return data.choices[0].message.content;
}