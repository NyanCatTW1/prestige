var FormatList = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QaDc', 'QtDc', 'SxDc', 'SpDc', 'ODc', 'NDc', 'Vg', 'UVg', 'DVg', 'TVg', 'QaVg', 'QtVg', 'SxVg', 'SpVg', 'OVg', 'NVg', 'Tg', 'UTg', 'DTg', 'TTg', 'QaTg', 'QtTg', 'SxTg', 'SpTg', 'OTg', 'NTg', 'Qd', 'UQd', 'DQd', 'TQd', 'QaQd', 'QtQd', 'SxQd', 'SpQd', 'OQd', 'NQd', 'Qi', 'UQi', 'DQi', 'TQi', 'QaQi', 'QtQi', 'SxQi', 'SpQi', 'OQi', 'NQi', 'Se', 'USe', 'DSe', 'TSe', 'QaSe', 'QtSe', 'SxSe', 'SpSe', 'OSe', 'NSe', 'St', 'USt', 'DSt', 'TSt', 'QaSt', 'QtSt', 'SxSt', 'SpSt', 'OSt', 'NSt', 'Og', 'UOg', 'DOg', 'TOg', 'QaOg', 'QtOg', 'SxOg', 'SpOg', 'OOg', 'NOg', 'Nn', 'UNn', 'DNn', 'TNn', 'QaNn', 'QtNn', 'SxNn', 'SpNn', 'ONn', 'NNn', 'Ce', ];

function formatValue(value, places = 3, placesUnder1000 = 0) {
  if (value >= 1000) {
    if (value instanceof Decimal) {
      var power = value.e
      var matissa = value.mantissa
    } else {
      var matissa = value / Math.pow(10, Math.floor(Math.log10(value)));
      var power = Math.floor(Math.log10(value));
    }
    
    if (power >= 33) {
      matissa = matissa.toFixed(places)
      if (matissa >= 10) {
        matissa /= 10;
        power++;
      }
      if (power > 100000) return (matissa + "e" + power.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      return (matissa + "e" + power);
    }

    matissa = (matissa * Decimal.pow(10, power % 3)).toFixed(places)
    if (matissa >= 1000) {
      matissa /= 1000;
      power++;
    }
    return matissa + " " + FormatList[(power - (power % 3)) / 3];
    
  } else {
    return (value).toFixed(placesUnder1000);
  }
}