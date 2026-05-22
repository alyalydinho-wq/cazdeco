import { useState, useEffect } from 'react';
import { X, Calculator } from 'lucide-react';

interface CarrelageCalculatorProps {
  key?: string | number;
  isOpen: boolean;
  onClose: () => void;
  productTileLength: number;
  productTileWidth: number;
  tilesPerBox: number;
  sqmPerBox: number;
  onApplyQuantity: (qty: number) => void;
}

const PoseDroiteSvg = ({ selected }: { selected: boolean }) => (
  <svg viewBox="-50 -10 100 60" className={`w-full h-24 mb-2 transition-colors ${selected ? 'text-[#65A30D]' : 'text-gray-400 group-hover:text-[#65A30D]'}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <g transform="translate(0, 5)">
      {[0, 1, 2].map(row => 
        [0, 1, 2].map(col => {
          const px = (col - row) * 15;
          const py = (col + row) * 7.5;
          return <path key={`${row}-${col}`} d={`M${px},${py} l15,7.5 l-15,7.5 l-15,-7.5 Z`} fill={selected ? "#f0fdf4" : "white"} />
        })
      )}
    </g>
  </svg>
);

const PoseDecaleeSvg = ({ selected }: { selected: boolean }) => (
  <svg viewBox="-60 -10 120 60" className={`w-full h-24 mb-2 transition-colors ${selected ? 'text-[#65A30D]' : 'text-gray-400 group-hover:text-[#65A30D]'}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <g transform="translate(0, 5)">
      {[0, 1, 2].map(row => 
        [0, 1, 2].map(col => {
          const x = col + (row % 2 === 0 ? 0 : 0.5) - 1;
          const y = row;
          const px = (x - y) * 15;
          const py = (x + y) * 7.5;
          return <path key={`${row}-${col}`} d={`M${px},${py} l15,7.5 l-15,7.5 l-15,-7.5 Z`} fill={selected ? "#f0fdf4" : "white"} />
        })
      )}
    </g>
  </svg>
);

const PoseDiagonaleSvg = ({ selected }: { selected: boolean }) => (
  <svg viewBox="-50 -10 100 60" className={`w-full h-24 mb-2 transition-colors ${selected ? 'text-[#65A30D]' : 'text-gray-400 group-hover:text-[#65A30D]'}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <g transform="translate(-10, 10)">
      {[0, 1, 2].map(row => 
        [0, 1, 2].map(col => {
          const px = col * 20 - row * 10;
          const py = row * 10;
          return <path key={`${row}-${col}`} d={`M${px},${py} l20,0 l-10,10 l-20,0 Z`} fill={selected ? "#f0fdf4" : "white"} />
        })
      )}
    </g>
  </svg>
);

export default function CarrelageCalculator({ 
  isOpen, onClose, productTileLength, productTileWidth, tilesPerBox, sqmPerBox, onApplyQuantity 
}: CarrelageCalculatorProps) {
  const [pieceLength, setPieceLength] = useState<string>('');
  const [pieceWidth, setPieceWidth] = useState<string>('');
  const [tileLength, setTileLength] = useState<string>(productTileLength.toString());
  const [tileWidth, setTileWidth] = useState<string>(productTileWidth.toString());
  const [poseType, setPoseType] = useState<'droite' | 'decalee' | 'diagonale'>('droite');

  // Sync state with product default dimensions when the calculator opens or when product dimensions change
  useEffect(() => {
    if (isOpen) {
      setTileLength(productTileLength.toString());
      setTileWidth(productTileWidth.toString());
    }
  }, [isOpen, productTileLength, productTileWidth]);

  if (!isOpen) return null;

  // Logic calculation
  const pLength = parseFloat(pieceLength) || 0;
  const pWidth = parseFloat(pieceWidth) || 0;
  
  const surfacePiece = pLength * pWidth;
  const coeffChute = poseType === 'droite' ? 1.05 : poseType === 'decalee' ? 1.10 : 1.15;
  const surfaceAvecChutes = surfacePiece * coeffChute;
  
  const tLength = parseFloat(tileLength) || 0;
  const tWidth = parseFloat(tileWidth) || 0;
  const surfaceCarreauM2 = (tLength / 100) * (tWidth / 100);
  const nbCarreaux = surfaceCarreauM2 > 0 ? Math.ceil(surfaceAvecChutes / surfaceCarreauM2) : 0;
  
  const nbBoites = tilesPerBox > 0 ? Math.ceil(nbCarreaux / tilesPerBox) : 0;
  const conditionnementTotal = nbBoites * sqmPerBox;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-caz-gray-light sticky top-0 z-20">
          <h2 className="font-heading font-black text-xl flex items-center gap-2">
            <Calculator size={24} className="text-caz-red" />
            Calculateur de quantité
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-caz-red transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Section 1 */}
          <section>
            <h3 className="font-heading font-bold text-lg mb-4 text-caz-gray-dark border-l-4 border-caz-red pl-3">1. Dimensions de votre pièce</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Longueur du sol (en m)</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  value={pieceLength} 
                  onChange={(e) => setPieceLength(e.target.value)}
                  placeholder="ex: 6.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-caz-red focus:ring-1 focus:ring-caz-red outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Largeur du sol (en m)</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  value={pieceWidth} 
                  onChange={(e) => setPieceWidth(e.target.value)}
                  placeholder="ex: 3.2"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:border-caz-red focus:ring-1 focus:ring-caz-red outline-none"
                />
              </div>
            </div>
            {surfacePiece > 0 && (
              <p className="text-sm text-gray-500 mt-2">Surface de la pièce : <span className="font-bold text-gray-800">{surfacePiece.toFixed(2)} m²</span></p>
            )}
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="font-heading font-bold text-lg mb-4 text-caz-gray-dark border-l-4 border-caz-red pl-3">2. Pose de votre carrelage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className={`relative block border rounded-lg p-3 cursor-pointer text-center transition ${poseType === 'droite' ? 'border-[#65A30D] ring-1 ring-[#65A30D]' : 'border-gray-200 hover:border-[#65A30D]'}`}>
                <input type="radio" name="pose" checked={poseType === 'droite'} onChange={() => setPoseType('droite')} className="hidden" />
                <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${poseType === 'droite' ? 'border-[#65A30D]' : 'border-gray-300'}`}>
                  {poseType === 'droite' && <div className="w-2.5 h-2.5 rounded-full bg-[#65A30D]"></div>}
                </div>
                <PoseDroiteSvg selected={poseType === 'droite'} />
                <div className="font-medium text-[15px] text-gray-800">Pose droite</div>
              </label>
              <label className={`relative block border rounded-lg p-3 cursor-pointer text-center transition ${poseType === 'decalee' ? 'border-[#65A30D] ring-1 ring-[#65A30D]' : 'border-gray-200 hover:border-[#65A30D]'}`}>
                <input type="radio" name="pose" checked={poseType === 'decalee'} onChange={() => setPoseType('decalee')} className="hidden" />
                <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${poseType === 'decalee' ? 'border-[#65A30D]' : 'border-gray-300'}`}>
                  {poseType === 'decalee' && <div className="w-2.5 h-2.5 rounded-full bg-[#65A30D]"></div>}
                </div>
                <PoseDecaleeSvg selected={poseType === 'decalee'} />
                <div className="font-medium text-[15px] text-gray-800">Pose décalée</div>
              </label>
              <label className={`relative block border rounded-lg p-3 cursor-pointer text-center transition ${poseType === 'diagonale' ? 'border-[#65A30D] ring-1 ring-[#65A30D]' : 'border-gray-200 hover:border-[#65A30D]'}`}>
                <input type="radio" name="pose" checked={poseType === 'diagonale'} onChange={() => setPoseType('diagonale')} className="hidden" />
                <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${poseType === 'diagonale' ? 'border-[#65A30D]' : 'border-gray-300'}`}>
                  {poseType === 'diagonale' && <div className="w-2.5 h-2.5 rounded-full bg-[#65A30D]"></div>}
                </div>
                <PoseDiagonaleSvg selected={poseType === 'diagonale'} />
                <div className="font-medium text-[15px] text-gray-800">Pose en diagonale</div>
              </label>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h3 className="font-heading font-bold text-lg mb-4 text-caz-gray-dark border-l-4 border-caz-red pl-3">3. Dimensions de votre carrelage</h3>
            <p className="-mt-3 mb-4 text-sm text-gray-500">Retrouvez ces informations dans les caractéristiques de la fiche produit.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Longueur du carreau (cm)</label>
                <input type="number" step="0.1" min="0" value={tileLength} onChange={(e) => setTileLength(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded focus:border-caz-red focus:ring-1 focus:ring-caz-red outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Largeur du carreau (cm)</label>
                <input type="number" step="0.1" min="0" value={tileWidth} onChange={(e) => setTileWidth(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded focus:border-caz-red focus:ring-1 focus:ring-caz-red outline-none" />
              </div>
            </div>
          </section>

          {/* Results */}
          <div className="bg-gray-900 text-white p-6 rounded-lg">
            <h4 className="font-heading font-bold mb-4 uppercase tracking-wider text-sm opacity-80">Résultat de votre calcul</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <span className="block text-3xl font-light mb-1">{conditionnementTotal > 0 ? conditionnementTotal.toFixed(2) : '-'}</span>
                <span className="text-xs uppercase tracking-wider opacity-70">m² à commander</span>
              </div>
              <div className="text-center border-t sm:border-t-0 sm:border-l border-white/20 pt-4 sm:pt-0">
                <span className="block text-3xl font-light mb-1">{nbCarreaux > 0 ? nbCarreaux : '-'}</span>
                <span className="text-xs uppercase tracking-wider opacity-70">Carreaux nécessaires</span>
              </div>
              <div className="text-center border-t sm:border-t-0 sm:border-l border-white/20 pt-4 sm:pt-0">
                <span className="block text-4xl font-bold text-caz-red mb-1">{nbBoites > 0 ? nbBoites : '-'}</span>
                <span className="text-xs uppercase tracking-wider opacity-70">Boîtes à commander</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-end bg-gray-50 sticky bottom-0">
          <button 
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 font-bold rounded hover:bg-gray-100 transition"
          >
            Fermer
          </button>
          <button 
            disabled={nbBoites === 0}
            onClick={() => {
              onApplyQuantity(nbBoites);
              onClose();
            }}
            className={`px-8 py-3 font-bold rounded transition text-white ${nbBoites > 0 ? 'bg-green-600 hover:bg-green-700 shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Appliquer la quantité ({nbBoites} {nbBoites > 1 ? 'boîtes' : 'boîte'})
          </button>
        </div>

      </div>
    </div>
  );
}
