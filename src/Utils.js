import config from "./config";

class Utils {

    static prefixUrl = config.baseUrl;
    static prefixUser = config.img.user;
    static prefixLogo = config.img.logo;
    static prefixVideo = config.video;

    static writeNumber(nb) {
        nb = String(nb);
        if (nb > 999 && nb < 1000000) {
            let tamp = nb.slice(0, -3);
            nb = tamp + ' k';
        }
        else if (nb > 999999) {
            let fNb = nb.slice(0, 1);
            let sNb = nb.slice(1, 2);
            nb = `${fNb},${sNb} M`;
        }
        return nb;
    }

    static writeDateDev(date) {
        let jour = date.getDate();
        let mois = date.getMonth() + 1;
        let annee = date.getFullYear();
        if (jour < 10) {
            jour = '0' + jour;
        }
        switch (mois) {
            case 1:
                mois = 'Janvier';
                break;
            case 2:
                mois = 'Février';
                break;
            case 3:
                mois = 'Mars';
                break;
            case 4:
                mois = 'Avril';
                break;
            case 5:
                mois = 'Mai';
                break;
            case 6:
                mois = 'Juin';
                break;
            case 7:
                mois = 'Juillet';
                break;
            case 8:
                mois = 'Août';
                break;
            case 9:
                mois = 'Septembre';
                break;
            case 10:
                mois = 'Octobre';
                break;
            case 11:
                mois = 'Novembre';
                break;
            case 12:
                mois = 'Décembre';
                break;
            default:
                break;
        }
        date = `${jour} ${mois} ${annee}`;
        return date;
    }

    static writeDateSimple(date) {
        let jour = date.getDate();
        let mois = date.getMonth() + 1;
        let annee = date.getFullYear();
        if (jour < 10) {
            jour = '0' + jour;
        }
        if (mois < 10) {
            mois = '0' + mois;
        }
        date = `${jour}/${mois}/${annee}`;
        return date;
    }
}

export default Utils;