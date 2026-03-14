const passwordInput = document.getElementById("password")
const lengthSlider = document.getElementById("length")
const lengthDisplay = document.getElementById("length-value")
const upperCaseCheckbox = document.getElementById("uppercase")
const lowerCaseCheckbox = document.getElementById("lowercase")
const numbersCheckbox = document.getElementById("numbers")
const symbolsCheckbox = document.getElementById("symbols")
const generateButton = document.getElementById("generate-btn")
const copyButton = document.getElementById("copy-btn")
const strengthBar = document.querySelector(".strength-bar")
const strengthText = document.querySelector(".strength p")
const strengthLabel = document.getElementById("strength-label")

//character sets
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRESTUVWXYZ"
const lowercaseLetters = "abcdefghijklmnopqrstuvwxys"
const numbersCharacters = "1234567890"
const symbolCharacters = "!@#$%^&*(){}||\:;'.,?/=+-_"

//password length score
lengthSlider.addEventListener("input",()=>{
    lengthDisplay.textContent = lengthSlider.value
})

// event that trigger lengthSlider password button 
generateButton.addEventListener("click",makePassword)

// function that run when someone clicked on generate password button
function makePassword(){
    //get the length of password from slider
    const length = Number(lengthSlider.value)
    const includeUppercase = upperCaseCheckbox.checked
    const includeLowercase = lowerCaseCheckbox.checked
    const includeNumbers = numbersCheckbox.checked
    const includeSymbols = symbolsCheckbox.checked

    //If no checkbox is selected
    if(!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols){
        alert("please select atleast one character type")
        return;
    }

    //varibale that hold new password
    const newPassword = createRandomPassword(length,includeUppercase,includeLowercase,includeNumbers,includeSymbols)
    //text input on page which is read only
    passwordInput.value = newPassword
    //function that check strongness of password is call
    updateStringMeter(newPassword)
}

//function that create new password on the basis of length
function createRandomPassword(length,includeUppercase,includeLowercase,includeNumbers,includeSymbols){
    let allCharacters = "";
    if(includeUppercase) allCharacters += uppercaseLetters;
    if(includeLowercase) allCharacters += lowercaseLetters;
    if(includeNumbers ) allCharacters += numbersCharacters;
    if(includeSymbols) allCharacters += symbolCharacters;
    console.log(allCharacters)
    let password = ""

    for(let i=0; i < length; i++){
        const randomIndex = Math.floor(Math.random()* allCharacters.length)
        password += allCharacters[randomIndex]  
    }
    return password
}


//logic that create slider on the basis of new password strength
function updateStringMeter(password){
    const passwordLength = password.length
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers= /[0-9]/.test(password)
    const hasSymbols = /[!@#$%^&*(){}||\:;'.,?/=+-_]/.test(password)

    let strengthScore = 0;
    //here the .min will get the minimum value
    //but this will make sure that "at maximum" you would get 40
    strengthScore += Math.min(passwordLength * 2, 40)

    if(hasUpperCase) strengthScore += 15
    if(hasLowerCase) strengthScore += 15
    if(hasNumbers) strengthScore += 15
    if(hasSymbols) strengthScore += 15

    //enforce minimum score for every short password
    if(passwordLength < 8){
        strengthScore = Math.min(strengthScore,25)
    }
    //ensure the width of the strength bar is valid percentage
    const safeScore = Math.max(5, Math.min(100,strengthScore))
    strengthBar.style.width = safeScore + "%"

    let strengthLableText = ""
    let barColor = ""
    if(strengthScore < 40){
        //weak password
        barColor = "#fc8181"
        strengthLableText = "Weak"
    }else if(strengthScore < 70){
        barColor = "#fbd38d" //yellow
        strengthLableText = "Medium"
    }
    else{
        barColor = "#68d391" //yellow
        strengthLableText = "Strong"
    }
    strengthBar.style.backgroundColor = barColor;
    strengthLabel.textContent = strengthLableText
}

//create password at the moment page load
window.addEventListener("DOMContentLoaded",makePassword)


//copy functionality
copyButton.addEventListener("click",()=>{
    if(!passwordInput.value) return
    navigator.clipboard.writeText(passwordInput.value)
    .then(()=> showCopySuccess()) 
    .catch((error))
})

function showCopySuccess(){
    copyButton.classList.remove("fa-regular","fa-copy")
    copyButton.classList.add("fas","fa-check")
    copyButton.style.color = "#48bb78"

    setTimeout(()=>{
        copyButton.classList.remove("fas","fa-check")
        copyButton.classList.add("fa-regular","fa-copy")
        copyButton.style.color = "blue"
    },1500)
}