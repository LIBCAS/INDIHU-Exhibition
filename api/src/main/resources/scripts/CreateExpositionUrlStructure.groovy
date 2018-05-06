import cz.inqool.uas.indihu.entity.domain.Exposition
import cz.inqool.uas.indihu.entity.domain.ExpositionUrl
import cz.inqool.uas.indihu.repository.ExpositionRepository
import cz.inqool.uas.indihu.repository.ExpositionUrlRepository

ExpositionRepository expositionRepository = spring.getBean(ExpositionRepository.class)
ExpositionUrlRepository expositionUrlRepository = spring.getBean(ExpositionUrlRepository.class)

List<Exposition> expositions = expositionRepository.findAll()
List<Exposition> toSave = new ArrayList<>()
for (Exposition exposition:expositions){
    ExpositionUrl url = expositionUrlRepository.save(new ExpositionUrl(exposition,exposition.getUrl()))
    Set<ExpositionUrl> set = new HashSet<>();
    set.add(url)
    exposition.setUrls(set)
    toSave.add(exposition)
}
expositionRepository.save(toSave)