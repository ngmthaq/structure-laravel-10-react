<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon.png') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('favicon-16x16.png') }}">
    <link rel="manifest" href="{{ asset('site.webmanifest') }}">

    <title></title>

    @viteReactRefresh

    @vite('resources/css/app.css')
    @vite('resources/scss/app.scss')
</head>

<body>
    <div id="app"></div>

    <script>
        function processTranslations(translations) {
            const output = {};
            for (const key in translations) {
                if (Object.hasOwnProperty.call(translations, key)) {
                    const element = translations[key];
                    if (Array.isArray(element)) {
                        output[key] = {};
                    } else if (typeof element === "object") {
                        output[key] = processTranslations(element);
                    } else {
                        output[key] = element;
                    }
                }
            }
            return output;
        }

        const jsonTranslations = @php echo $translations @endphp;

        const translations = JSON.parse(jsonTranslations);

        window.translations = processTranslations(translations);
    </script>

    @vite('resources/js/app.js')
    @vite('resources/react/index.jsx')

</body>

</html>
