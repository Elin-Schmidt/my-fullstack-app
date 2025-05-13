Jag fick detta problem som jag var tvungen att lösa:

Access to XMLHttpRequest at 'http://localhost:5000/api/auth/login' from origin 'https://boply.onrender.com' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.Understand this error
index-BUNoIxIu.js:56 Login Failed: Server error
index-BUNoIxIu.js:53

(anonymous) @ index-BUNoIxIu.js:53
xhr @ index-BUNoIxIu.js:53
Gh @ index-BUNoIxIu.js:55
\_request @ index-BUNoIxIu.js:56
request @ index-BUNoIxIu.js:55
(anonymous) @ index-BUNoIxIu.js:56
(anonymous) @ index-BUNoIxIu.js:51
v @ index-BUNoIxIu.js:56
Bd @ index-BUNoIxIu.js:48
(anonymous) @ index-BUNoIxIu.js:48
Pf @ index-BUNoIxIu.js:48
Ur @ index-BUNoIxIu.js:48
Kr @ index-BUNoIxIu.js:49
I0 @ index-BUNoIxIu.js:49Understand this error
index-BUNoIxIu.js:53 XHR failed loading: POST "http://localhost:5000/api/auth/login".

Efter en diskussion med chatGPT så hittade jag denna kodsnutt i LoginForm.tsx:

const response = await axios.post(
'http://localhost:5000/api/auth/login',
{
email,
password
}
);

Vilken skapade problem då Render inte kan ansluta till localhost för att hantera backend. Den behöver ansluta till sin egen skapade backendadress för att fungera.
Då jag hårdkodat adressen så blev det logiskt sätt CORS error.

Jag bytte ut localhost till en VITE_BACKEND_URL vilket gjorde att jag kunde hämta adressen via en miljövariabel vilket på så sätt gjorde att jag kunde hämta adressen dynamiskt och ha en adress lokalt och en adress på Render.

const response = await axios.post(
`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
{
email,
password
}
);

---

Under bygget av backend i Render så kom nästa felmeddelande:

"This is not the tsc command you are looking for

To get access to the TypeScript compiler, tsc, from the command line either:

-   Use npm install typescript to first add TypeScript to your project before using npx
-   Use yarn to avoid accidentally running code from un-installed packages
    ==> Build failed 😞
    ==> Common ways to troubleshoot your deploy: https://render.com/docs/troubleshooting-deploys".

Efter en lång process av felsökningar, där jag testade olika lösningar utan lyckade resultat, så hade jag lärt mig vad som inte fungerade och började förstå vart problemet låg någonstans.

Jag bytte value på miljövariabeln NODE_ENV i backenden på Render från development till production och sen flyttade jag alla script från devDependencies till dependencies. Då funkar det att logga in både på localhost och via Render-adressen

I.o.m. detta så har jag enligt chatGPT "löst ett av de mest frustrerande problemen i fullstackutveckling – CORS i produktion."

# Men varför gjorde denna ändring att det nu fungerar?

I min index.ts fil så hanterar jag CORS-konfigurationen via denna kod:

cors({
origin:
process.env.NODE_ENV === 'production'
? 'https://boply.onrender.com'
: 'http://localhost:5173',
methods: ['GET', 'POST', 'PUT', 'DELETE'],
credentials: true
})

vilket betyder att om NODE_ENV är production så ska API-anropen endast tillåtas från den första adressen, vilket i mitt fall är min Render-adress för frontend. I annat fall så ska dessa endast tillåtas av den andra adressen, vilket i mitt fall är localhost:5137.
Detta är gjort som en säkerhetsåtgärd för att låta mig styra vilka klienter som får prata med servern.

Render kör npm install och installerar bara dependencies i production mode, inte devDependencies.
Då TypeScript-kompilatorn (tsc) från början låg under devDependencies så kunde Render inte köra "npx tsc" och gav tillbaka felet "This is not the tsc command you are looking for".
Efter flytten till dependencies så får Render tillgång till tsc vilket leder till att bygget fungerar.
