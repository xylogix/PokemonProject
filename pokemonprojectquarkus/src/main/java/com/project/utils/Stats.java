package com.project.utils;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class Stats { // Correspond à la section "stats"
    private int hp;      // Correspond au champ "hp" dans "stats"
    private int atk;     // Correspond au champ "atk" dans "stats"
    private int def;     // Correspond au champ "def" dans "stats"
    private int spe_atk; // Correspond au champ "spe_atk" dans "stats"
    private int spe_def; // Correspond au champ "spe_def" dans "stats"
    private int vit;     // Correspond au champ "vit" dans "stats"

    public int somme() {
        return hp + atk + def + spe_atk + spe_def + vit;
    }

    public void augmenterStats(int i) {
        //on augmente les stats du pokemon de 1% * i

        hp += hp * i / 100;
        atk += atk * i / 100;
        def += def * i / 100;
        spe_atk += spe_atk * i / 100;
        spe_def += spe_def * i / 100;
        vit += vit * i / 100;

    }
}
