`use strict`;

module.exports = (folder, langs, fallback = null) => {
    if (!langs || (Array.isArray(langs) && langs.length === 0)) {
        throw new Error(`You need to add at least one language.`);
    }

    const languages = {};

    langs.forEach(lang => (languages[lang] = require(`${folder}/${lang}.json`)));

    const i18n = function (lang, keyword, variables = {}) {
        if (!languages[lang]) {
            return keyword;
        }

        const value = keyword
            .split(`.`)
            .reduce(
                (res, key) => res && res[key],
                languages[lang]
            );

        if (!value) {
            if (fallback && lang !== fallback) {
                return i18n(fallback, keyword, variables);
            } else {
                return keyword;
            }
        }

        return  value.replace(
            /\{{2}(.+?)\}{2}/g,
            (_, variable) => variables[variable] || variable
        );
    };

    i18n.languages = Object.keys(languages);
    return i18n;
};
