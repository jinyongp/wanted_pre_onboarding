function escapeRegExp(regex) {
  return regex.replaceAll(/[\^$.*+?()[\]{}|]/g, '\\$&');
}

/**
 * 초성에서 음절로 변환한다.
 *
 * ㄱ~ㅃ 사이에는 종성에만 사용할 수 있는 초성이 섞여있어 동일한 offset을 이동할 때 엉뚱한 곳으로 이동한다.
 * 이를 별도로 지정하고, ㅅ 이후부터 순서대로 증가한다.
 */
const convertInitialToSyllable = (ch) => {
  const initialToSyllable = {
    ㄱ: '가'.charCodeAt(0),
    ㄲ: '까'.charCodeAt(0),
    ㄴ: '나'.charCodeAt(0),
    ㄷ: '다'.charCodeAt(0),
    ㄸ: '따'.charCodeAt(0),
    ㄹ: '라'.charCodeAt(0),
    ㅁ: '마'.charCodeAt(0),
    ㅂ: '바'.charCodeAt(0),
    ㅃ: '빠'.charCodeAt(0),
    ㅅ: '사'.charCodeAt(0),
  };
  return (
    initialToSyllable[ch] || (ch.charCodeAt(0) - 'ㅅ'.charCodeAt(0)) * 588 + initialToSyllable['ㅅ']
  );
};

/**
 * 한글 글자 코드 = [자음번호 × 588 + 모음번호 × 28 + 종성번호] + 44032
 *
 * (0 부터 시작)
 * 자음번호 { ㄱ, ㄲ, ㄴ, ㄷ, ㄸ, ㄹ, ㅁ, ㅂ, ㅃ, ㅅ, ㅆ, ㅇ, ㅈ, ㅉ, ㅊ, ㅋ, ㅌ, ㅍ, ㅎ } (총 19개)
 * 모음번호 { ㅏ, ㅐ, ㅑ, ㅒ, ㅓ, ㅔ, ㅕ, ㅖ, ㅗ, ㅘ, ㅙ, ㅚ, ㅛ, ㅜ, ㅝ, ㅞ, ㅟ, ㅠ, ㅡ, ㅢ, ㅣ } (총 21개)
 * 종성번호 { none, ㄱ, ㄲ, ㄳ, ㄴ, ㄵ, ㄶ, ㄷ, ㄹ, ㄺ, ㄻ, ㄼ, ㄽ, ㄾ, ㄿ, ㅀ, ㅁ, ㅂ, ㅄ, ㅅ, ㅆ, ㅇ, ㅈ, ㅊ, ㅋ, ㅌ, ㅍ, ㅎ } (총 28개)
 *
 * @see https://en.wikipedia.org/wiki/Korean_language_and_computers
 */
function koreanRegExp(ch) {
  const offset = '가'.charCodeAt(0);
  if (/[가-힣]/.test(ch)) {
    const charCode = ch.charCodeAt(0) - offset;
    if (charCode % 28 > 0) return ch; // 종성이 존재하는 음절
    const begin = Math.floor(charCode / 28) * 28 + offset;
    return `[\\u${begin.toString(16)}-\\u${(begin + 27).toString(16)}]`;
  } else if (/[ㄱ-ㅎ]/.test(ch)) {
    const begin = convertInitialToSyllable(ch);
    return `[${ch}\\u${begin.toString(16)}-\\u${(begin + 587).toString(16)}]`;
  }
  return ch;
}

export function getFuzzyMatcher(value) {
  return new RegExp(value.split('').map(escapeRegExp).map(koreanRegExp).join('.*?'), 'gi');
}
