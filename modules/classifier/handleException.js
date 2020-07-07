const handleException = (url) => {
  console.log('handleException');
  try {
    if (
      //! 쿠팡
      url.indexOf('https://m.coupang.com/') > -1 ||
      url.indexOf('https://www.coupang.com') > -1 ||
      //! 네이버 쇼핑
      url.indexOf('shopping.naver.com/') > -1 ||
      //! 옥션
      url.indexOf('auction.co.kr/') > -1 ||
      //! 지마켓
      url.indexOf('gmarket.co.kr/') > -1 ||
      //! ssg
      url.indexOf('shinsegaemall.ssg.com') > -1 ||
      //! 알리 익스프레스
      url.indexOf('aliexpress.com') > -1 ||
      //! 다나와
      url.indexOf('prod.danawa.com') > -1 ||
      url.indexOf('http://m.danawa.com/product/') > -1
    ) {
      return { result: 18, analysis: [{ score: 1, label: '/shopping' }] };
    } else if (
      //! 예외 2 네이버 사전, 파파고
      url.indexOf('dict.naver.com') > -1 ||
      url.indexOf('papago.naver.com') > -1
    ) {
      return { result: 4, analysis: [{ score: 1, label: '/education' }] };
    } else if (
      url.indexOf('https://soundcloud.com/') > -1 ||
      url.indexOf('https://m.soundcloud.com/') > -1 ||
      url.indexOf('netflix.com') > -1
    ) {
      return {
        result: 1,
        analysis: [{ score: 1, label: '/art and entertainment' }],
      };
    } else {
      return url;
    }
  } catch (err) {
    console.log('handleException Error');
    console.log(err);
  }
};
module.exports = handleException;
