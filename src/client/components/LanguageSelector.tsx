import React, { CSSProperties, useState } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const LanguageSelector = props => {
  const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false);
  const { i18n } = useTranslation();
  const selectedLanguage = i18n.language;

  return (
    <div onClick={() => setLanguageSelectorOpen(!languageSelectorOpen)} style={{ position: "fixed", right: 0, bottom: 0, zIndex: 999, width: "70px" }}>
      {languageSelectorOpen == true && (
        <div>
          <div onClick={() => i18n.changeLanguage("en")} className={`languages border-bottom `}>
            English
          </div>
          <br />
          <div onClick={() => i18n.changeLanguage("es")} className={`languages border-bottom`}>
            Español
          </div>
          <br />
          <div onClick={() => i18n.changeLanguage("fr")} className={`languages border-bottom`}>
            Français
            <br />
          </div>
        </div>
      )}
      <img className="ms-3" src="/static/language-selector.svg" width={40} height={40} />
    </div>
  );
};

export default connect()(LanguageSelector);
