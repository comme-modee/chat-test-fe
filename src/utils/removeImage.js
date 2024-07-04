const removeImages = (content) => {
    // 이미지 마크다운 구문을 매칭하는 정규 표현식
    const regex = /!\[.*?\]\(.*?\)/g;
    // 이미지 마크다운 구문을 빈 문자열로 대체하여 이미지를 제거한 순수 텍스트를 반환
    const plainTextContent = content.replace(regex, "");
    return plainTextContent;
};

module.exports = removeImages;
