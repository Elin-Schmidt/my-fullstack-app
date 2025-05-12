Jag implementerade ett login formulär och försökte logga in användaren som fanns inlagd i databasen.
Jag fick hela tiden felmeddelande i konsollen:

Felet "POST http://localhost:5000/api/auth/login 401 (Unauthorized)" indikerar att backend-servern inte godkänner inloggningsförfrågan. Detta kan bero på flera orsaker, inklusive felaktiga inloggningsuppgifter eller problem med backend-logiken.
Nu började en lång felsökningsprocess.
Jag började logga mer och mer information till konsollen för att "narrow the problem down".
Jag testade även att hårdkoda ett konto för att se om det var problem relaterat till databasen eller själva koden.
Den hårdkodade användaren fungerade utan fel medan användaren i databasen fortfarande inte fungerade.
Efter ca 3 timmar så lyckades jag med hjälp av denna:

if (!isPasswordCorrect) {
console.log('Login Failed: Incorrect password');
res.status(401).json({ message: 'Invalid email or password.' });
return;
}

få ut att det var lösenordet som skapade problemet.
Med all den samlade informationen jag fått så sa det _pling_ i huvudet på mig och jag började fundera på om problemet hade att göra med att lösenordet hos användaren i databasen var inlagd direkt i databasen medan login-funktionen jämförde med ett bcrypt-hashat lösenord och därför så blev det fail.
Jag skapade en hashPassword.js för att göra om det befintliga databas-lösenordet till en hashad variant och se om det skulle fungera. Själva "hashningen" fungerade men efter att jag uppdaterat lösenordet i databasen till den hashad versionen så fungerade det iaf inte att logga in.
Jag fick då nästa idé att testa, vilket var att skapa ett formulär för att registrera en ny användare som sedan sparas i databasen med ett medföljande krypterat lösenord och se om det skulle göra någon skillnad.
Efter att ha skapat testanvändare nr 2 så testade jag att logga in den personen och fick tillbaka i konsollen: Login Successful.

Lättnaden jag kände när jag äntligen fått till det är obeskrivlig. Jag lärde mig så mycket på vägen vad som inte fungerade.
Tack och lov så är en av mina favoritmoment att just felsöka så även om jag emellanåt var frustrerad och ville slita av mig håret så njöt jag av processen och kände mig väldigt motiverad av min envishet att lösa utmaningen.
