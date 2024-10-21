const Formatters = {
  trimURL: function(answer: string) {
    try {
      const url = new URL(answer.startsWith('www.') ? 'http://' + answer : answer);
      let domain = url.hostname;
      if (domain.startsWith('www.')) {
        domain = domain.substring(4);
      }
      return domain;
    } catch (error) {
      return answer;
    }
  }
}

export default Formatters;
