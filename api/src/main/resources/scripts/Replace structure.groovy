import cz.inqool.uas.indihu.entity.domain.Exposition
import cz.inqool.uas.indihu.repository.ExpositionRepository

ExpositionRepository repository = spring.getBean(ExpositionRepository.class)
Collection<Exposition> expositions = repository.findAll()
for(Exposition ex:expositions){
    if (ex.getStructure()!=null){
//        printf(ex.getStructure().replaceAll("\\\"(image|video|music|audio|image1|image2)\\\"\\:\\{\\\"id\\\"\\:(\\\"[^\\\"]+\\\")[^\\}]*\\}", "\\\"\$1\\\":\$2"))
        ex.setStructure(ex.getStructure().replaceAll("\\\"(image|video|music|audio|image1|image2)\\\"\\:\\{\\\"id\\\"\\:(\\\"[^\\\"]+\\\")[^\\}]*\\}", "\\\"\$1\\\":\$2"))
        repository.save(ex)
    }}
1