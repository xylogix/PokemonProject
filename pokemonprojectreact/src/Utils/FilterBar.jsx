import React from 'react';

const FilterBar = ({
                       filterName,
                       setFilterName,
                       filterType,
                       setFilterType,
                       minMontant,
                       setMinMontant,
                       maxMontant,
                       setMaxMontant,
                       types, // Liste des types Pokémon
                   }) => {
    return (
        <div
            style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                marginBottom: '20px',
                flexWrap: 'wrap',
            }}
        >
            <input
                type="text"
                placeholder="Rechercher un Pokémon"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                style={{
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    width: '200px',
                }}
            />
            <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    width: '150px',
                }}
            >
                <option value="">Tous les types</option>
                {types.map((type, index) => (
                    <option key={index} value={type}>
                        {type}
                    </option>
                ))}
            </select>
            <input
                type="number"
                placeholder="Montant min"
                value={minMontant}
                onChange={(e) => setMinMontant(e.target.value)}
                style={{
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    width: '120px',
                }}
            />
            <input
                type="number"
                placeholder="Montant max"
                value={maxMontant}
                onChange={(e) => setMaxMontant(e.target.value)}
                style={{
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    width: '120px',
                }}
            />
        </div>
    );
};

export default FilterBar;
