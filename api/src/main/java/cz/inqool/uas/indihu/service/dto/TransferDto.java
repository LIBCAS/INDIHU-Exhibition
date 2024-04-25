package cz.inqool.uas.indihu.service.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class TransferDto {

    private List<String> expositionIds = new ArrayList<>();
}
