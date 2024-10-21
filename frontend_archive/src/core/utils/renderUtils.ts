  interface IColumnClassNamesProps {
    oddColumnClassName: string
    evenColumnClassName: string
  }
  
  export const getColumnClassName = (layout: string | undefined): IColumnClassNamesProps => {
    switch (layout) {
      case "one-half":
        return {
          oddColumnClassName: "one-half",
          evenColumnClassName: "one-half",
        }
  
      case "one-third":
        return {
          oddColumnClassName: "one-third",
          evenColumnClassName: "one-third",
        }
  
      case "one-third-mixed":
        return {
          oddColumnClassName: "one-third",
          evenColumnClassName: "two-thirds",
        }
  
      case "two-thirds":
        return {
          oddColumnClassName: "two-thirds",
          evenColumnClassName: "two-thirds",
        }
  
      case "two-thirds-mixed":
        return {
          oddColumnClassName: "two-thirds",
          evenColumnClassName: "one-third",
        }
  
      case "one-quarter":
        return {
          oddColumnClassName: "one-quarter",
          evenColumnClassName: "one-quarter",
        }
  
      case "one-quarter-mixed":
        return {
          oddColumnClassName: "one-quarter",
          evenColumnClassName: "three-quarters",
        }
  
      case "three-quarters":
        return {
          oddColumnClassName: "three-quarters",
          evenColumnClassName: "three-quarters",
        }
  
      case "three-quarters-mixed":
        return {
          oddColumnClassName: "three-quarters",
          evenColumnClassName: "one-quarter",
        }
  
      default:
        return {
          oddColumnClassName: "full",
          evenColumnClassName: "full",
        }
    }
  }